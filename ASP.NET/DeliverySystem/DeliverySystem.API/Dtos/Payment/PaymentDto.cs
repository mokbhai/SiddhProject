using DeliverySystem.API.Enums;

namespace DeliverySystem.API.Dtos.Payment;

public record PaymentDto
{
    public string PaymentId { get; set; } = default!;
    public int Amount { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public string OrderId { get; set; } = default!;
    public PaymentStatusEnum Status { get; set; } = default!;
    public PaymentTypeEnum PaymentType { get; set; } = default!;
}