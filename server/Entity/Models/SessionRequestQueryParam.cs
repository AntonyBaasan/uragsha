using System;

namespace Entity.Services
{
    public record SessionRequestQueryParam
    {
        public string UserId { get; init; }
        public DateTime? StartDate { get; init; }
        public DateTime? EndDate { get; init; }
        public int? Status { get; init; }
        public int? SessionType { get; init; }
    }
}