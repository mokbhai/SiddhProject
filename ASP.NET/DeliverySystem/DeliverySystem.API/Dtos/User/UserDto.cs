using DeliverySystem.API.Enums;

namespace DeliverySystem.API.Dtos.User;

public record UserDto
{
    public string UserId { get; set; } = default!;
    public string EmailId { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string UserAddress { get; set; } = default!;
    public UserTypeEnum UserType { get; set; } = default!;
}