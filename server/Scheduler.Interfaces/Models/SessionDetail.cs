using System;

namespace Scheduler.Interfaces.Models
{
    public class SessionDetail
    {
        public string SessionId { get; set; }
        public DateTime Started { get; set; }
        public WebRtcMessage Offer { get; set; }
        public WebRtcMessage Answer { get; set; }
        public CallStateEnum State { get; set; }
    }

    public enum CallStateEnum
    {
        waiting, // waiting to stablish webrtc connection
        joined, // joined user will do their own actions - edit workout list and start workout
        done, // both users are finished the workouts
    }
}
