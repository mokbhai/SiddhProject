namespace DeliverySystem.API.Dtos.Order;

public record CreateOrderDto
{
    public string ItemName { get; set; } = default!;
    
    public string UserId { get; set; } = default!;

    public string UserAddress { get; set; } = default!;
}