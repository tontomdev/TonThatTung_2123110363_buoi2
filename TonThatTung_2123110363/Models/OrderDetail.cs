using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TonThatTung_2123110363.Models
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }

        // ===== FK Order =====
        public int OrderId { get; set; }
        public Order? Order { get; set; }

        // ===== FK Product =====
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }
    }
}