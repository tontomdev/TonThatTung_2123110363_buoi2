namespace TonThatTung_2123110363.DTOs.Products
{
    public class ProductRequestDto
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}