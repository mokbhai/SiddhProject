using Shared.Sdk.Dtos;

namespace Ecommerce.Api.Dtos.Account;

public record LoginAccountDto : BaseDto
{
    public string UserName { get; set; }
    public string Password { get; set; }
}