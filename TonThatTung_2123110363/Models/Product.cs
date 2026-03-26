using System.ComponentModel.DataAnnotations;

namespace TonThatTung_2123110363.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ProductName { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public string? Description { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}