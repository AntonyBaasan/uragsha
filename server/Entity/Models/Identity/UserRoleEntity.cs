using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Models.Identity
{
    [Table("UserRoles")]
    public class UserRoleEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<UserEntity> Users { get; set; }
    }
}