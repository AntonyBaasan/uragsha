using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;
using Messaging.Interfaces.Models;
using Messaging.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;

namespace Messagin.Http.Services
{
    public class HttpMessageSender : IMessageSender
    {
        private readonly IHttpClientFactory clientFactory;
        private readonly string signallingUrl;
        private readonly string serviceAccountKey;

        public HttpMessageSender(IConfiguration configuration, IHttpClientFactory clientFactory)
        {
            this.signallingUrl = configuration.GetSection("Url:Signalling").Value;
            this.serviceAccountKey = configuration.GetSection("ApiKey:ServiceAccountKey").Value;
            this.clientFactory = clientFactory;
        }

        public async Task<bool> SendMessageAsync(IMessage message)
        {
            using (var content = new StringContent(JsonConvert.SerializeObject(message), System.Text.Encoding.UTF8, "application/json"))
            {
                var url = GetUrl(message);
                var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Content = content;
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                var client = clientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", serviceAccountKey);
                var response = await client.SendAsync(request);

                return response.IsSuccessStatusCode;
            }
        }

        private string GetUrl(IMessage message)
        {
            if (message.GetMessageType() == MessageType.HubMessage)
            {
                return this.signallingUrl + "/api/messagelistener";
            }
            return "";
        }
    }
}
