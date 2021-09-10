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
        public int Status { get; set; }
        public string? SessionId { get; set; }
        public virtual SessionEntity Session { get; set; }
    }
}
