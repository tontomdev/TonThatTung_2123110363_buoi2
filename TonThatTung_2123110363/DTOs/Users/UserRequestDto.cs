namespace TonThatTung_2123110363.DTOs.Users
{
    public class UserRequestDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public int RoleId { get; set; }
    }
}