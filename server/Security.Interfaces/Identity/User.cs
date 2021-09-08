using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Identity.Interfaces.Identity
{
    public class User
    {
        // by EF convension this will became Primary key
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; init; }
        public string DisplayName { get; init; }
        public string PhotoUrl { get; init; }
        public UserStatus Status { get; set; }
        public UserPlan Plan { get; set; }
        [NotMapped] // TODO: need to convert properly
        public List<UserRole> Roles { get; set; }
    }
}
