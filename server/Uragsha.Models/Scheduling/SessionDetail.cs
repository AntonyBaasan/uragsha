using System;

namespace Uragsha.Models.Scheduling
{
    public class SessionDetail
    {
        public string SessionId { get; set; }
        public DateTime Started { get; set; }
        public WebRtcMessage Offer { get; set; }
        public WebRtcMessage Answer { get; set; }
    }

    public class WebRtcMessage
    {
        public string UserId { get; set; }
        public object Content { get; set; }

    }
}
