using System.Collections.Generic;

namespace Uragsha.Models.Identity
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public UserStatus Status { get; set; }
        public UserPlan Plan { get; set; }
        public List<UserRole> Roles { get; set; }
    }
}
