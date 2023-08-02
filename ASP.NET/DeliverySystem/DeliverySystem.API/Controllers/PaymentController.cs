using DeliverySystem.API.Dtos.Payment;
using DeliverySystem.API.Interfaces.Service;
using Microsoft.AspNetCore.Mvc;

namespace DeliverySystem.API.Controllers;

[ApiController]
[Microsoft.AspNetCore.Components.Route("[controller]")]

public class PaymentController
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPatch("Payment")]
    public PaymentDto CreatePayment(PaymentDto paymentDto)
    {
        var payment = _paymentService.CreatePaymentDto(paymentDto);
        return payment;
    }
}