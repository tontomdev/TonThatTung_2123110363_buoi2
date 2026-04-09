using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TonThatTung_2123110363.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending";

        public int UserId { get; set; }
        public User? User { get; set; }

        public ICollection<OrderDetail>? OrderDetails { get; set; }

        public Payment? Payment { get; set; }
    }
}