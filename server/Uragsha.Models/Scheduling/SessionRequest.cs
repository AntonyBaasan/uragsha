using System;
using System.ComponentModel.DataAnnotations;

namespace Uragsha.Models.Scheduling
{
    public class SessionRequest
    {
        [Key]
        public string Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Title { get; set; }
        public string UserId { get; set; }
        public SessionRequestStatus Status { get; set; }
        public string SessionId { get; set; }
    }
}
