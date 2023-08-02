using Shared.Sdk.Entities;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Api.Entities;

public record OrderProduct : BaseEntity
{
    [ForeignKey("Product")]
    public string ProductId { get; set; } = default!;

    [ForeignKey("Order")]
    public string OrderId { get; set; } = default!;

    [MaxLength(15), Required]
    public int Quantity { get; set; } = default!;

    public Order Order { get; set; } = default!;

    public Product Product { get; set; } = default!;
}
