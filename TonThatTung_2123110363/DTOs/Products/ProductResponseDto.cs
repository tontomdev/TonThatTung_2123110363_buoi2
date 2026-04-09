namespace TonThatTung_2123110363.DTOs.Products
{
    public class ProductResponseDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? Description { get; set; }
        public string? Thumbnail { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; } 
    }
}