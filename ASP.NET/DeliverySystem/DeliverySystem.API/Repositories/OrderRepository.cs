using DeliverySystem.API.DbConfig;
using DeliverySystem.API.Entities;
using DeliverySystem.API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.API.Repositories;

public class OrderRepository : IOrderRepository
{
    public Order CreateOrder(Order orderEntity)
    {
        using var context = new DeliverySystemDbContext();
        orderEntity.CreatedAtUtc = DateTime.UtcNow; // Set the CreatedAtUtc property
        orderEntity.UpdatedAtUtc = DateTime.UtcNow;
        context.Orders.Add(orderEntity);
        context.SaveChanges();
        return orderEntity;
    }
    public Order GetOrderById(string orderId)
    {
        using var context = new DeliverySystemDbContext();
        var order = context.Orders.FirstOrDefault(x => x.OrderId == orderId);
        if (order == null) throw new BadHttpRequestException("Order Not Found");
        return order;    
    }

    public List<Order> GetOrdersByUserId(string userId)
    {
        using var context = new DeliverySystemDbContext();
        var orders = context.Orders.Where(x => x.UserId == userId);
        return orders.ToList();
    }

    public Order UpdateOrder(Order order)
    {
        using var context = new DeliverySystemDbContext();
        context.Orders.Update(order);
        context.SaveChanges();
        return order;
    }

    public Order DeleteOrder(string orderId)
    {
        using var context = new DeliverySystemDbContext();
        var order = context.Orders.FirstOrDefault(x => x.OrderId == orderId);
        if (order == null) throw new BadHttpRequestException("Order Not Found");
        order.IsDeleted = true;
        context.Orders.Update(order);
        context.SaveChanges();
        return order;
    }
}
