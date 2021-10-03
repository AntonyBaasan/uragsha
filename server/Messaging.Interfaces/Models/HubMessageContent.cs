using System.Collections.Generic;

namespace Messaging.Interfaces.Models
{
    public class HubMessageContent
    {
        public List<string> ToUserId { get; set; }
        public string Method { get; set; }
        public object Params { get; set; }
    }
}
