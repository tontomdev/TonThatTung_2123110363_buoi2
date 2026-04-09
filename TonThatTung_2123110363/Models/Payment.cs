using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TonThatTung_2123110363.Models
{
    [Table("Payments")]
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Column("order_id")]
        public int OrderId { get; set; }

        [Required]
        [StringLength(50)]
        public string Method { get; set; } = "Cash";

        [Required]
        public decimal Amount { get; set; }

        // navigation
        public Order? Order { get; set; }
    }
}