using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DeliverySystem.API.Enums;

namespace DeliverySystem.API.Entities;

public record Payment : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

    public string PaymentId { get; set; }
    public int Amount { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public string OrderId { get; set; } = default!;
    public PaymentStatusEnum Status { get; set; } = default!;
    public PaymentTypeEnum PaymentType { get; set; } = default!;
}