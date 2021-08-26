namespace Uragsha.Signalling.Dto
{
    public record UserDto
    {
        public string Uid { get; init; }
        public string Email { get; init; }
        public string DisplayName { get; init; }
        public string PhotoUrl { get; init; }
        public string Token { get; init; }
    }
}
