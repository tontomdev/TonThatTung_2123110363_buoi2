using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TonThatTung_2123110363.Data;
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
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            return await _context.Payments
                                 .Include(p => p.Order) // lấy luôn Order liên quan
                                 .ToListAsync();
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
            // kiểm tra order tồn tại
            var order = await _context.Orders.FindAsync(payment.OrderId);
            if (order == null)
                return BadRequest("Order không tồn tại");

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
        }

        // PUT: api/payment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, Payment payment)
        {
            if (id != payment.Id)
                return BadRequest();

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Payments.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
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