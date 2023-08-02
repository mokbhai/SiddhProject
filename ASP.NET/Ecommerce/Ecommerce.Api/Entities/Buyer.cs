using Shared.Sdk.Entities;

using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Api.Entities;

public record Buyer : BaseEntity
{
    public string Name { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;

    [ForeignKey("Account")]
    public string AccountId { get; set; } = default!;
    public Account Account { get; set; } = default!;
}