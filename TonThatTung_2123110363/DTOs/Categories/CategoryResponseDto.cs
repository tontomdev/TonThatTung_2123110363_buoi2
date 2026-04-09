namespace TonThatTung_2123110363.DTOs.Categories
{
    public class CategoryResponseDto
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ProductCount { get; set; } // tùy chọn, số lượng sản phẩm thuộc category
    }
}