namespace DeliverySystem.API.Dtos.Order;
public record UpdateOrderDto
{
    public string ItemName { get; set; } = default!;
    
    public string UserAddress { get; set; } = default!;

    public string OrderId { get; set; } = default!;
}