using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DeliverySystem.API.Enums;

namespace DeliverySystem.API.Entities;

public record Order : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

    public string OrderId { get; set; }

    public string ItemName { get; set; } = default!;

    public OrderStatusEnum OrderStatus { get; set; } = default!;

    public string UserId { get; set; } = default!;
    
    public string UserAddress { get; set; } = default!;

}