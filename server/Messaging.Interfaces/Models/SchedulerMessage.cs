namespace Messaging.Interfaces.Models
{
    public class SchedulerMessage : IMessage
    {
        public object Content { get; set; }

        public object GetContent()
        {
            return Content;
        }

        public MessageType GetMessageType()
        {
            return MessageType.SchedulerMessage;
        }
    }
}
