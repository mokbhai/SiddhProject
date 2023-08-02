using System.ComponentModel.DataAnnotations;
using Ecommerce.Api.Enums;
using Shared.Sdk.Entities;

namespace Ecommerce.Api.Entities;

public record Account : BaseEntity
{
    [MaxLength(50), Required]
    public string UserName { get; set; } = default!;

    [MaxLength(50), Required]
    public string Password { get; set; } = default!;
    public AccountTypeEnum AccountType { get; set; } = default!;

    [MaxLength(12), Required]
    public string PhoneNumber { get; set; } = default!;
}