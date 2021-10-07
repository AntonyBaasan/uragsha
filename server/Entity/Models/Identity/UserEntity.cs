using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Models.Identity
{
    [Table("Users")]
    public class UserEntity
    {
        // by EF convension this will became Primary key
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; init; }
        public string DisplayName { get; init; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? PhotoUrl { get; init; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public int Status { get; set; }
        public int Plan { get; set; }
        public virtual ICollection<UserRoleEntity> Roles { get; set; }
    }
}
