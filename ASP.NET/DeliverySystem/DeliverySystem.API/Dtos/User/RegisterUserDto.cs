namespace DeliverySystem.API.Dtos.User;

public record RegisterUserDto()
{
    public string UserId { get; set; } = default!;
    public string EmailId { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string UserAddress { get; set; } = default!;
}