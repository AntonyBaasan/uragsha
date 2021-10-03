namespace Messaging.Interfaces.Models
{
    public interface IMessage
    {
        public MessageType GetMessageType();
        public object GetContent();
    }
}
