using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Uragsha.Models.Scheduling
{
    public class Session
    {
        [Key]
        public string Id { get; set; }
        public DateTime Start;
        public DateTime End;
        [NotMapped]
        public List<string> SessionRequestIds { get; set; }
        public string SessionRequestIdsAsString
        {
            get { return string.Join(",", SessionRequestIds); }
            set { SessionRequestIds = value.Split(',').ToList(); }
        }
        [NotMapped]
        public Dictionary<string, object> LiveUsers { get; set; }
    }
}
