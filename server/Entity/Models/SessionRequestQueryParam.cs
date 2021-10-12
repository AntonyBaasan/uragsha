using System;
using System.Collections.Generic;

namespace Entity.Services
{
    public record SessionRequestQueryParam
    {
        public string UserId { get; init; }
        public DateTime? StartDate1 { get; init; }
        public DateTime? StartDate2 { get; init; }
        public DateTime? EndDate1 { get; init; }
        public DateTime? EndDate2 { get; init; }
        public List<int> Status { get; init; }
        public int? SessionType { get; init; }
    }
}