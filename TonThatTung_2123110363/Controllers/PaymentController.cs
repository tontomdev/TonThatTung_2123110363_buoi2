using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TonThatTung_2123110363.Data;
using TonThatTung_2123110363.DTOs.Payments;
using TonThatTung_2123110363.Models;

namespace TonThatTung_2123110363.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/payment
[HttpGet]
public async Task<IActionResult> GetPayments()
{
    var payments = await _context.Payments
        .Select(p => new PaymentDto
        {
            Id = p.Id,
            OrderId = p.OrderId,
            Method = p.Method,
            Amount = p.Amount
        })
        .ToListAsync();

    return Ok(payments);
}

        // GET: api/payment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments
                                        .Include(p => p.Order)
                                        .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null)
                return NotFound();

            return payment;
        }

        // POST: api/payment
        [HttpPost]
        public async Task<ActionResult<Payment>> CreatePayment(Payment payment)
        {
            var order = await _context.Orders.FindAsync(payment.OrderId);
            if (order == null)
                return BadRequest("Order không tồn tại");

            payment.Amount = order.TotalAmount;

            _context.Payments.Add(payment);

            // 🔥 cập nhật trạng thái order
            order.Status = "Paid";

            await _context.SaveChangesAsync();

            return Ok(payment);
        }

        // PUT: api/payment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, Payment dto)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound();

            payment.Method = dto.Method;
            payment.Amount = dto.Amount;
            payment.OrderId = dto.OrderId;

            await _context.SaveChangesAsync();

            return Ok(payment);
        }

        // DELETE: api/payment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound();

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}