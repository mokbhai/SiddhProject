using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Ecommerce.Api.Enums;
using Shared.Sdk.Entities;

namespace Ecommerce.Api.Entities;

public record Product : BaseEntity
{
    [MaxLength(150), Required]
    public string Name { get; set; } = default!;

    [MaxLength(1000), Required]
    public string Description { get; set; } = default!;

    [Range(0, 10), Required]
    public decimal Price { get; set; } = default!;
    public CategoryEnum Category { get; set; }

    [ForeignKey("Seller")]
    public string SellerId { get; set; } = default!;
    public Seller Seller { get; set; } = default!;
}