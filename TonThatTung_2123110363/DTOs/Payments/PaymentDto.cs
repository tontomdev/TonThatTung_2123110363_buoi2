namespace TonThatTung_2123110363.DTOs.Payments
{
    public class PaymentDto
    {
        public int OrderId { get; set; }
        public string Method { get; set; } = "Cash";
        public decimal Amount { get; set; }
    }
}