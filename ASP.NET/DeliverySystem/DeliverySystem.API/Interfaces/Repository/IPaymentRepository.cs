using DeliverySystem.API.Entities;

namespace DeliverySystem.API.Interfaces.Repository;

public interface IPaymentRepository
{
    public Payment CreatePayment(Payment payment);
}