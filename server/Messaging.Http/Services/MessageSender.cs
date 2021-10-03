using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;
using Messaging.Interfaces.Models;
using Messaging.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Messaging.Http.Services
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
            var result = await SendMessageAsync(new List<IMessage> { message });
            return result.First();
        }

        public async Task<List<bool>> SendMessageAsync(List<IMessage> messages)
        {
            var groupedByMessageType = messages.GroupBy((msg) => msg.GetMessageType());

            List<bool> result = new List<bool>();
            foreach (var messageType in groupedByMessageType)
            {
                var url = GetUrl(messageType.Key);
                var messageSentResult = await SendMessagesHttpAsync(url, messages);
                result.Add(messageSentResult);
            }

            return result;
        }

        private async Task<bool> SendMessagesHttpAsync(string url, List<IMessage> message)
        {
            using (var content = new StringContent(JsonConvert.SerializeObject(message), System.Text.Encoding.UTF8, "application/json"))
            {
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
            return GetUrl(message.GetMessageType());
        }

        private string GetUrl(MessageType messageType)
        {
            if (messageType == MessageType.HubMessage)
            {
                return this.signallingUrl + "/api/messagelistener";
            }
            return "";
        }
    }
}
