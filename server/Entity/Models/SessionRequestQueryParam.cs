using System;

namespace Entity.Services
{
    public record SessionRequestQueryParam
    {
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? UserId { get; init; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public DateTime? StartDate { get; init; }
        public DateTime? EndDate { get; init; }
        public int? Status { get; init; }
    }
}