namespace Messaging.Interfaces.Models
{
    public interface IMessage
    {
        public MessageType GetMessageType();
        public object GetContent();
    }

    public class HubMessageContent
    {
        public string ToUserId { get; set; }
        public string Method { get; set; }
        public object Params { get; set; }
    }
}
