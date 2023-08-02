using DeliverySystem.API.DbConfig;
using DeliverySystem.API.Entities;
using DeliverySystem.API.Interfaces.Repository;

namespace DeliverySystem.API.Repositories;

public class PaymentRepository : IPaymentRepository
{
    public Payment CreatePayment(Payment payment)
    {
        using var context = new DeliverySystemDbContext();
        payment.CreatedAtUtc = DateTime.UtcNow; // Set the CreatedAtUtc property
        payment.UpdatedAtUtc = DateTime.UtcNow;
        context.Payments.Add(payment);
        context.SaveChanges();
        return payment;
    }
}