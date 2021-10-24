namespace Identity.Interfaces.Models
{
    public class UserStat
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }

        public int SessionCount { get; set; }
        public int WeeklySessionCount { get; set; }
        public int InRowSessionCount { get; set; }
    }
}
