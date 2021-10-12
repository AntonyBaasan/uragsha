using System;

namespace Scheduler.Interfaces.Models
{
    public record FindSessionRequestArgs
    {
        public string UserId { get; init; }
        public DateTime? Start1 { get; init; }
        public DateTime? Start2 { get; init; }
        public DateTime? End1 { get; init; }
        public DateTime? End2 { get; init; }
        public SessionRequestStatus? Status { get; init; }
        public SessionRequestType? SessionType { get; init; }
    }
}
