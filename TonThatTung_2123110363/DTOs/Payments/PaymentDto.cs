namespace TonThatTung_2123110363.DTOs.Payments
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string Method { get; set; }
        public decimal Amount { get; set; }
    }
}