using AutoMapper;
using DeliverySystem.API.Dtos.Order;
using DeliverySystem.API.Dtos.Payment;
using DeliverySystem.API.Dtos.User;
using DeliverySystem.API.Entities;

namespace DeliverySystem.API.Mappers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        #region Order
        CreateMap<Order, OrderDto>();
        CreateMap<Order, CreateOrderDto>();
        CreateMap<Order, UpdateOrderDto>();
        CreateMap<OrderDto, Order>();
        CreateMap<CreateOrderDto, Order>();
        CreateMap<UpdateOrderDto, Order>();
        #endregion

        #region User
        CreateMap<LoginUserDto, User>();
        CreateMap<User, LoginUserDto>();
        CreateMap<User, RegisterUserDto>();
        CreateMap<RegisterUserDto, User>();
        CreateMap<UserDto, User>();
        CreateMap<User, UserDto>();

        #endregion

        #region Payment

        CreateMap<Payment, PaymentDto>();
        CreateMap<PaymentDto, Payment>();

        #endregion
    }
}