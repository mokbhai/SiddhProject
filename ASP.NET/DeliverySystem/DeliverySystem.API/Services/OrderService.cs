using AutoMapper;
using DeliverySystem.API.Dtos.Order;
using DeliverySystem.API.Entities;
using DeliverySystem.API.Interfaces;
using DeliverySystem.API.Interfaces.Repository;
using DeliverySystem.API.Interfaces.Service;
using DeliverySystem.API.Repositories;

namespace DeliverySystem.API.Services;

public class OrderService : IOrderService
{
    private readonly IMapper _mapper;
    private readonly IOrderRepository _orderRepository;

    public OrderService(IMapper mapper, IOrderRepository orderRepository)
    {
        _mapper = mapper;
        _orderRepository = orderRepository;
    }

    public OrderDto CreateOrder(CreateOrderDto createOrderDto)
    {
        var orderEntity = _mapper.Map<Order>(createOrderDto);
        orderEntity = _orderRepository.CreateOrder(orderEntity);
        return _mapper.Map<OrderDto>(orderEntity);
    }

    public OrderDto GetOrderById(string orderId)
    {
        var orderEntity = _orderRepository.GetOrderById(orderId);
        return _mapper.Map<OrderDto>(orderEntity);
    }

    public List<OrderDto> GetOrdersByUserId(string userId)
    {
        var orderEntities = _orderRepository.GetOrdersByUserId(userId);
        return _mapper.Map<List<OrderDto>>(orderEntities);
    }

    public OrderDto UpdateOrder(UpdateOrderDto updateOrderDto)
    {
        var orderEntity = _mapper.Map<Order>(updateOrderDto);
        orderEntity = _orderRepository.UpdateOrder(orderEntity);
        return _mapper.Map<OrderDto>(orderEntity);
    }

    public OrderDto DeleteOrder(string orderId)
    {
        var orderEntity = _orderRepository.DeleteOrder(orderId);
        return _mapper.Map<OrderDto>(orderEntity);
    }
}