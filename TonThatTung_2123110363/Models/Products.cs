using System.ComponentModel.DataAnnotations;
namespace TonThatTung_2123110363.Models
{
    public class Products
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string ProductName { get; set; } = string.Empty;
    }
}
