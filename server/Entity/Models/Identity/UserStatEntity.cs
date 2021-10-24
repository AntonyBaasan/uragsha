using System.ComponentModel.DataAnnotations.Schema;
using Identity.Interfaces.Models;

namespace Entity.Models.Identity
{
    [Table("UserStat")]
    public class UserStatEntity
    {
        // by EF convension this will became Primary key
        public string Id { get; set; }
        public int SessionCount { get; set; }
        public int WeeklySessionCount { get; set; }
        public int InRowSessionCount { get; set; }

        public string UserId { get; set; }
        public UserEntity User { get; set; }
    }
}
