using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TonThatTung_2123110363.Data;
using TonThatTung_2123110363.Models;
using TonThatTung_2123110363.DTOs.Orders;

namespace TonThatTung_2123110363.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET ALL ORDERS (FOR ADMIN / POS LIST)
        // =====================================================
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payment)
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    id = o.Id,
                    userName = o.User != null ? o.User.FullName : "Guest",
                    orderDate = o.OrderDate,
                    totalAmount = o.TotalAmount,
                    status = o.Status,
                    itemsCount = o.OrderDetails.Count,

                    payment = o.Payment == null ? null : new
                    {
                        method = o.Payment.Method,
                        amount = o.Payment.Amount
                    }
                })
                .ToListAsync();

            return Ok(orders);
        }

        // =====================================================
        // GET ORDER BY ID (FOR BILL / DETAIL)
        // =====================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Payment)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound("Order không t?n t?i");

            var result = new OrderResponseDto
            {
                Id = order.Id,
                UserId = order.UserId,
                UserName = order.User?.FullName,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,

                // ===== ORDER DETAILS =====
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailResponseDto
                {
                    ProductId = od.ProductId,
                    ProductName = od.Product?.ProductName,
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList(),

                // ===== PAYMENT =====
                Payment = order.Payment == null ? null : new PaymentResponseDto
                {
                    Id = order.Payment.Id,
                    Method = order.Payment.Method,
                    Amount = order.Payment.Amount
                }
            };

            return Ok(result);
        }
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return NotFound("Không tìm th?y ??n hàng");

            order.Status = status;

            await _context.SaveChangesAsync();

            return Ok(order);
        }
        // =====================================================
        // CREATE ORDER (POS MAIN API)
        // =====================================================
        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // =========================
                // VALIDATION
                // =========================
                if (request.OrderDetails == null || !request.OrderDetails.Any())
                    return BadRequest("Gi? hàng tr?ng");

                if (request.Payment == null)
                    return BadRequest("Thi?u thông tin thanh toán");

                var userId = request.UserId ?? 3;

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return BadRequest("User không t?n t?i");

                // =========================
                // CREATE ORDER
                // =========================
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.Now,
                    Status = "Pending"
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // =========================
                // LOAD PRODUCTS (FOR PRICE SAFETY)
                // =========================
                var productIds = request.OrderDetails.Select(x => x.ProductId).ToList();

                var products = await _context.Products
                    .Where(p => productIds.Contains(p.Id))
                    .ToListAsync();

                // =========================
                // CREATE ORDER DETAILS
                // =========================
                var orderDetails = request.OrderDetails.Select(item =>
                {
                    var product = products.FirstOrDefault(p => p.Id == item.ProductId);

                    if (product == null)
                        throw new Exception("Product không t?n t?i");

                    return new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Price = product.Price // l?y t? DB, KHÔNG l?y t? frontend
                    };
                }).ToList();

                _context.OrderDetails.AddRange(orderDetails);

                // =========================
                // CHECK + UPDATE STOCK
                // =========================
                foreach (var item in request.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);

                    if (product == null)
                        return BadRequest("S?n ph?m không t?n t?i");

                    if (product.Quantity < item.Quantity)
                        return BadRequest($"Không ?? hàng: {product.ProductName}");

                    product.Quantity -= item.Quantity;
                }

                // =========================
                // CALCULATE TOTAL (SERVER SIDE)
                // =========================
                var total = orderDetails.Sum(x => x.Price * x.Quantity);
                order.TotalAmount = total;

                // =========================
                // PAYMENT
                // =========================
                var payment = new Payment
                {
                    OrderId = order.Id,
                    Method = request.Payment.Method,
                    Amount = order.TotalAmount
                };

                _context.Payments.Add(payment);

                // =========================
                // SAVE ALL
                // =========================
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // =========================
                // RESPONSE
                // =========================
                var response = new OrderResponseDto
                {
                    Id = order.Id,
                    TotalAmount = total,
                    Status = order.Status,
                    OrderDate = order.OrderDate,

                    Payment = new PaymentResponseDto
                    {
                        Id = payment.Id,
                        Method = payment.Method,
                        Amount = payment.Amount
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            // xoá order details tr??c
            _context.OrderDetails.RemoveRange(order.OrderDetails);

            // xoá payment n?u có
            if (order.Payment != null)
                _context.Payments.Remove(order.Payment);

            // xoá order
            _context.Orders.Remove(order);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Xoá ??n hàng thành công" });
        }
    }
}