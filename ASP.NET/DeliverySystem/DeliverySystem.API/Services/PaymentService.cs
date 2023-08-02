using AutoMapper;
using DeliverySystem.API.Dtos.Payment;
using DeliverySystem.API.Entities;
using DeliverySystem.API.Interfaces.Repository;
using DeliverySystem.API.Interfaces.Service;

namespace DeliverySystem.API.Services;

public class PaymentService : IPaymentService
{
    private readonly IMapper _mapper;
    private readonly IPaymentRepository _paymentRepository;

    public PaymentService(IMapper mapper, IPaymentRepository paymentRepository)
    {
        _mapper = mapper;
        _paymentRepository = paymentRepository;
    }

    public PaymentDto CreatePaymentDto(PaymentDto paymentDto)
    {
        var paymentEntity = _mapper.Map<Payment>(paymentDto);
        paymentEntity = _paymentRepository.CreatePayment(paymentEntity);
        return _mapper.Map<PaymentDto>(paymentEntity);
    }
}