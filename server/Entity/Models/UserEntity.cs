using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Models
{
    [Table("Users")]
    public class UserEntity
    {
        // by EF convension this will became Primary key
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; init; }
        public string DisplayName { get; init; }
        public string? PhotoUrl { get; init; }
        public int Status { get; set; }
        public int Plan { get; set; }
        public virtual ICollection<UserRoleEntity> Roles { get; set; }
    }
}
