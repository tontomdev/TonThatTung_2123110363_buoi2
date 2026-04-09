using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TonThatTung_2123110363.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string? FullName { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [StringLength(100)]
        public string? Password { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        // FK Role
        public int RoleId { get; set; }

        [ForeignKey("RoleId")]
        public Role? Role { get; set; }

        // Navigation
        public ICollection<Order>? Orders { get; set; }
    }
}