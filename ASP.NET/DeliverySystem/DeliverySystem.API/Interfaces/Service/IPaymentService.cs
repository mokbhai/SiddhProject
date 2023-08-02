using DeliverySystem.API.Dtos.Payment;

namespace DeliverySystem.API.Interfaces.Service;

public interface IPaymentService
{
    public PaymentDto CreatePaymentDto(PaymentDto paymentDto);
}