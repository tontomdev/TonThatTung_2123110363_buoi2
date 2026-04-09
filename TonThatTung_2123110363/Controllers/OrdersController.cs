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

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderRequest request)
        {
            // 1. Ki?m tra user
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return BadRequest("User không t?n t?i");

            // 2. T?o Order
            var order = new Order
            {
                UserId = request.UserId,
                OrderDate = DateTime.Now,
                TotalAmount = request.Payment.Amount,
                Status = "Pending",
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // c?n save ?? có Order.Id

            // 3. T?o OrderDetails
            foreach (var item in request.OrderDetails)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Price
                };
                _context.OrderDetails.Add(orderDetail);
            }

            // 4. T?o Payment
            var payment = new Payment
            {
                OrderId = order.Id,
                Method = request.Payment.Method,
                Amount = request.Payment.Amount
            };
            _context.Payments.Add(payment);

            await _context.SaveChangesAsync();

            // Load l?i d? li?u ??y ?? ?? tr? v?
            var createdOrder = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, createdOrder);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return order;
        }
    }
}