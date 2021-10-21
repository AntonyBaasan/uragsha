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

    // at the momemnt this is a clone of SessionStatus enum
    public enum CallStateEnum
    {
        New, // waiting to stablish webrtc connection
        InProgress, // joined user will do their own actions - edit workout list and start workout
        Done, // both users are finished the workouts
        Deleted
    }
}
