using System;

namespace Scheduler.Interfaces.Models
{
    public class SessionRequestComment
    {
        public string Id { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsSuccessfulWorkout { get; set; }
        public string GivenSessionRequestId { get; set; }
        public string ReceivedSessionRequestId { get; set; }
        public SessionRequest GivenSessionRequest { get; set; }
        public SessionRequest ReceivedSessionRequest { get; set; }
        public string Comment { get; set; }
    }


}
