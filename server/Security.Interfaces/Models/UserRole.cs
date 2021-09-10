using System.ComponentModel.DataAnnotations;

namespace Identity.Interfaces.Models
{
    public class UserRole
    {
        [Key]
        public string Name { get; set; }
    }
}