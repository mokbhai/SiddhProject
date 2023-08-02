using System.ComponentModel.DataAnnotations.Schema;

using Ecommerce.Api.Enums;

using Shared.Sdk.Entities;

namespace Ecommerce.Api.Entities;

public record Order : BaseEntity
{
    [ForeignKey("Buyer")]
    public string BuyerId { get; set; } = default!;
    public string DeliveryAddress { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public OrderStatus Status { get; set; } = default!;

    public Buyer Buyer { get; set; } = default!;

    public List<OrderProduct> OrderProducts { get; set; } = default!;
}