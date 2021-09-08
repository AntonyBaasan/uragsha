using System.Collections.Generic;

namespace Identity.Interfaces.Identity
{
    public class User
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string Email { get; init; }
        public string DisplayName { get; init; }
        public string PhotoUrl { get; init; }
        public UserStatus Status { get; set; }
        public UserPlan Plan { get; set; }
        public List<UserRole> Roles { get; set; }
    }
}
