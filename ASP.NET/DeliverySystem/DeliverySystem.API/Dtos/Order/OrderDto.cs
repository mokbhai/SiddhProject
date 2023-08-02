using DeliverySystem.API.Enums;

namespace DeliverySystem.API.Dtos.Order;

public record OrderDto
{
    public string OrderId { get; set; } = default!;

    public string ItemName { get; set; } = default!;

    public OrderStatusEnum OrderStatus { get; set; } = default!;

    public string UserId { get; set; } = default!;
    
    public string UserAddress { get; set; } = default!;
} 