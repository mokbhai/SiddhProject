using System.ComponentModel.DataAnnotations;

namespace Entities.Model;

public record Todo : BaseEntity
{
    [MaxLength(50), Required]
    public string Task { get; set; } = default!;

    [MaxLength(200)]
    public string Description { get; set; } = default!;

    [Required]
    public ImportanceEnum Importance { get; set; } = default!;
}

