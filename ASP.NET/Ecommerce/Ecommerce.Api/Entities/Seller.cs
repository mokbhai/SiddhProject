using Shared.Sdk.Entities;

using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Api.Entities;

public record Seller : BaseEntity
{
    public string Name { get; set; } = default!;

    [ForeignKey("Account")]
    public string AccountId { get; set; } = default!;

    public Account Account { get; set; } = default!;

    public List<Product> Products { get; set; } = default!;
}