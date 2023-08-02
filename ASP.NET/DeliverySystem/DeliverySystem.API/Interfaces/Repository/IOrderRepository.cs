using DeliverySystem.API.Entities;

namespace DeliverySystem.API.Interfaces.Repository;

public interface IOrderRepository
{
    public Order CreateOrder(Order orderEntity);
    public Order GetOrderById(string orderId);
    public List<Order> GetOrdersByUserId(string userId);
    public Order UpdateOrder(Order order);
    public Order DeleteOrder(string orderId);

}