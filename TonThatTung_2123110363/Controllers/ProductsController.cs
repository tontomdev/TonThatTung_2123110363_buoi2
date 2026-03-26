using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TonThatTung_2123110363.Data;
using TonThatTung_2123110363.Models;

namespace YourProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product product)
        {
            var p = await _context.Products.FindAsync(id);

            if (p == null)
                return NotFound();

            p.ProductName = product.ProductName;

            await _context.SaveChangesAsync();

            return Ok(p);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var p = await _context.Products.FindAsync(id);

            if (p == null)
                return NotFound();

            _context.Products.Remove(p);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}