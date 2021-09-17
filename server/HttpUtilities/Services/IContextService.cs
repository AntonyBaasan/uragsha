namespace HttpUtilities.Services
{
    public interface IContextService
    {
        public string GetUserId();
        public string GetUserToken();
    }
}
