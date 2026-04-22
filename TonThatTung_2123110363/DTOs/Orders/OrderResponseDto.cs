using System;
using System.Collections.Generic;

namespace TonThatTung_2123110363.DTOs.Orders
{
    public class OrderResponseDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }

        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;

        public int ItemsCount { get; set; }

        public List<OrderDetailResponseDto> OrderDetails { get; set; } = new();

        public PaymentResponseDto? Payment { get; set; }
    }

    public class OrderDetailResponseDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;

        public int Quantity { get; set; }
        public decimal Price { get; set; }

        // dùng cho UI POS / bill
        public decimal SubTotal => Quantity * Price;
    }

    public class PaymentResponseDto
    {
        public int Id { get; set; }
        public string Method { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}