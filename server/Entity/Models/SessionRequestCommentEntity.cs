using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Models
{
    [Table("SessionRequestComment")]
    public class SessionRequestCommentEntity
    {
        [Key]
        public string Id { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsSuccessfulWorkout { get; set; }

        public string GivenSessionRequestId { get; set; }
        public string ReceivedSessionRequestId { get; set; }

        public SessionRequestEntity GivenSessionRequest { get; set; }
        public SessionRequestEntity ReceivedSessionRequest { get; set; }

        public string Comment { get; set; }
    }
}
