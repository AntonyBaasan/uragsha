using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Models
{
    [Table("SessionRequests")]
    public class SessionRequestEntity
    {
        [Key]
        public string Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Title { get; set; }
        public string UserId { get; set; }
        public int SessionType { get; set; }
        public int Status { get; set; }
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public string? SessionId { get; set; }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
        public virtual SessionEntity Session { get; set; }

        public string GivenSessionRequestCommentId { get; set; }
        public string ReceivedSessionRequestCommentId { get; set; }
        public SessionRequestCommentEntity GivenSessionRequestComment { get; set; }
        public SessionRequestCommentEntity ReceivedSessionRequestComment { get; set; }
    }
}
