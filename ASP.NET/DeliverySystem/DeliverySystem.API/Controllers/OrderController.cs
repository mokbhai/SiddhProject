using DeliverySystem.API.Dtos.Order;
using DeliverySystem.API.Interfaces;
using DeliverySystem.API.Interfaces.Service;
using DeliverySystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace DeliverySystem.API.Controllers;

[ApiController]
[Route("[controller]")]

public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("OrderId/{orderId}")]
    public OrderDto GetOrderByOrderId(string orderId)
    {
        var order = _orderService.GetOrderById(orderId);
        return order;
    }
    
    [HttpGet("UserId/{userId}")]
    public List<OrderDto> GetOrders(string userId)
    {
        List<OrderDto> orders = _orderService.GetOrdersByUserId(userId);
        return orders;
    }

    [HttpPost("CreateOrder")]
    public OrderDto CreateOrder([FromBody] CreateOrderDto createOrderDto)
    {
        OrderDto order = _orderService.CreateOrder(createOrderDto);
        return order;
    }

    [HttpPatch("UpdateOrder")]
    public OrderDto UpdateOrderById([FromBody] UpdateOrderDto updateOrderDto)
    {
        OrderDto order = _orderService.UpdateOrder(updateOrderDto);
        return order;
    }

    [HttpDelete("DeleteOrder")]
    public OrderDto DeleteOrderById(string orderId)
    {
        var order = _orderService.DeleteOrder(orderId);
        return order;
    }
}