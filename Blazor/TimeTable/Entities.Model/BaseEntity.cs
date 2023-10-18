using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Model;

public record BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = default!;
    [Timestamp]
    public DateTime CreatedAtUtc { get; set; } = default!;
    public string CreatedBy { get; set; } = "admin";
    [Timestamp]
    public DateTime UpdatedAtUtc { get; set; } = default!;
    public string Updatedby { get; set; } = "admin";
    public bool IsDeleted { get; set; } = false;
}