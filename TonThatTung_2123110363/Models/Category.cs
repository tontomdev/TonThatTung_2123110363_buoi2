using System.ComponentModel.DataAnnotations;

namespace TonThatTung_2123110363.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CategoryName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public ICollection<Product>? Products { get; set; }
    }
}