namespace TimeTable.Data.Entities;

public record TaskEntity : BaseEntity
{
    public string  Name { get; set; } = default!;
    public string  Description { get; set; } = default!;
    public ImportanceEnum Importance { get; set; }
    public StatusEnum Status { get; set; }
}

