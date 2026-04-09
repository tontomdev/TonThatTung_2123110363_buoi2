using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TonThatTung_2123110363.Data;
using TonThatTung_2123110363.Models;
using TonThatTung_2123110363.DTOs.Products;

namespace TonThatTung_2123110363.Controllers
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
            var products = await _context.Products
                .Include(p => p.Category)
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Description = p.Description,
                    Thumbnail = p.Thumbnail,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.CategoryName : null
                }).ToListAsync();

            return Ok(products);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Description = p.Description,
                    Thumbnail = p.Thumbnail,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.CategoryName : null
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // CREATE with image upload
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductRequestDto dto)
        {
            string? imagePath = null;

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                imagePath = "/images/" + fileName;
            }

            var product = new Product
            {
                ProductName = dto.ProductName,
                Price = dto.Price,
                Quantity = dto.Quantity,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                Thumbnail = imagePath
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var response = new ProductResponseDto
            {
                Id = product.Id,
                ProductName = product.ProductName,
                Price = product.Price,
                Quantity = product.Quantity,
                Description = product.Description,
                Thumbnail = product.Thumbnail,
                CategoryId = product.CategoryId,
                CategoryName = (await _context.Categories.FindAsync(product.CategoryId))?.CategoryName
            };

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, response);
        }

        // UPDATE with optional image upload
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductRequestDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            product.ProductName = dto.ProductName;
            product.Price = dto.Price;
            product.Quantity = dto.Quantity;
            product.Description = dto.Description;
            product.CategoryId = dto.CategoryId;

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                product.Thumbnail = "/images/" + fileName;
            }

            await _context.SaveChangesAsync();

            var response = new ProductResponseDto
            {
                Id = product.Id,
                ProductName = product.ProductName,
                Price = product.Price,
                Quantity = product.Quantity,
                Description = product.Description,
                Thumbnail = product.Thumbnail,
                CategoryId = product.CategoryId,
                CategoryName = (await _context.Categories.FindAsync(product.CategoryId))?.CategoryName
            };

            return Ok(response);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}