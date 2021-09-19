namespace Email.Interfaces.Models
{
    public record Contact(string Name, string Email);
    public record EmailInfo(Contact From, Contact To, string Subject, string BodyPlain, string BodyHtml);
}
