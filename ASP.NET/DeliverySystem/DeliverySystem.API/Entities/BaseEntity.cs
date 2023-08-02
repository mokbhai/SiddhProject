using System.ComponentModel.DataAnnotations;

namespace DeliverySystem.API.Entities;

public record BaseEntity
{
    [Timestamp]
    public DateTime CreatedAtUtc { get; set; } = default!;
    public string CreatedBy { get; set; } = "admin";
    [Timestamp]
    public DateTime UpdatedAtUtc { get; set; } = default!;
    public string Updatedby { get; set; } = "admin";
    public bool IsDeleted { get; set; } = false;
}