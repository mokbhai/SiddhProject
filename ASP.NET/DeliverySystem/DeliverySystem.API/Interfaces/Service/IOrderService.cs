using DeliverySystem.API.Dtos.Order;

namespace DeliverySystem.API.Interfaces.Service;

public interface IOrderService
{
    public OrderDto CreateOrder(CreateOrderDto createOrderDto);
    public OrderDto GetOrderById(string orderId);
    public List<OrderDto> GetOrdersByUserId(string userId);
    public OrderDto UpdateOrder(UpdateOrderDto updateOrderDto);
    public OrderDto DeleteOrder(string orderId);
}