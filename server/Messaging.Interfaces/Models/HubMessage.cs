namespace Messaging.Interfaces.Models
{
    public class HubMessage: IMessage
    {
        public HubMessageContent Content { get; set; }

        public MessageType GetMessageType() { return MessageType.HubMessage; }

        public object GetContent()
        {
            return this.Content;
        }

    }

}
