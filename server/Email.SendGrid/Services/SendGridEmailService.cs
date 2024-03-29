﻿using System.Threading.Tasks;
using Email.Interfaces.Models;
using Email.Interfaces.Services;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Email.SendGrid.Services
{
    public class SendGridEmailService : IEmailService
    {
        private readonly string apiKey;

        public SendGridEmailService(string apiKey)
        {
            this.apiKey = apiKey;
        }

        public async Task<bool> SendEmailAsync(EmailInfo info)
        {
            var client = new SendGridClient(this.apiKey);
            var from = new EmailAddress(info.From.Email, info.From.Name);
            var to = new EmailAddress(info.To.Email, info.To.Name);
            var msg = MailHelper.CreateSingleEmail(from, to, info.Subject, info.BodyPlain, info.BodyHtml);
            var response = await client.SendEmailAsync(msg);
            return response.IsSuccessStatusCode;
        }
    }
}
