using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Shared.Sdk.Entities;

namespace Ecommerce.Api.Entities;

public record Cart : BaseEntity
{
    [ForeignKey("Buyer")]
    public string BuyerId { get; set; } = default!;

    [ForeignKey("Product")]
    public string ProductId { get; set; } = default!;

    [MaxLength(15), Required]
    public int Quantity { get; set; } = default!;

    public Buyer Buyer { get; set; } = default!;
    public Product Product { get; set; } = default!;
}