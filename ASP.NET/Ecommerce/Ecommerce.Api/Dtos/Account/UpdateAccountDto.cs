using Shared.Sdk.Dtos;

namespace Ecommerce.Api.Dtos.Account;

public record UpdateAccountDto : BaseDto
{
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
}