using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TonThatTung_2123110363.Data;
using TonThatTung_2123110363.Models;

namespace TonThatTung_2123110363.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategorisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategorisController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categoris
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET api/Categoris/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound();

            return Ok(category);
        }

        // POST api/Categoris
        [HttpPost]
        public async Task<IActionResult> Post(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // PUT api/Categoris/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Category category)
        {
            var c = await _context.Categories.FindAsync(id);

            if (c == null)
                return NotFound();

            c.CategoryName = category.CategoryName;
            c.Description = category.Description;

            await _context.SaveChangesAsync();

            return Ok(c);
        }

        // DELETE api/Categoris/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _context.Categories.FindAsync(id);

            if (c == null)
                return NotFound();

            _context.Categories.Remove(c);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}