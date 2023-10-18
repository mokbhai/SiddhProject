namespace Entities.Model;

public record Todo : BaseEntity
{
    public string Task { get; set; } = default!;
    public ImportanceEnum Importance { get; set; } = default!;
}

