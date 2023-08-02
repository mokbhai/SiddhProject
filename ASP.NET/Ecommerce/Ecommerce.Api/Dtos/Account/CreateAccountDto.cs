using Shared.Sdk.Dtos;

namespace Ecommerce.Api.Dtos.Account;

public record CreateAccountDto : BaseDto
{
    public string UserName { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
}