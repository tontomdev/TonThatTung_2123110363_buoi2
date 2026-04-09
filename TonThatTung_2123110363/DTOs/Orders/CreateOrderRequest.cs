using System.Collections.Generic;

namespace TonThatTung_2123110363.DTOs.Orders
{
    public class CreateOrderRequest
    {
        public int UserId { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; }
        public PaymentDto Payment { get; set; }
    }

    public class OrderDetailDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class PaymentDto
    {
        public string Method { get; set; } = "Cash";
        public decimal Amount { get; set; }
    }
}