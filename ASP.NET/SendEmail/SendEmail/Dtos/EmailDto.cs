namespace SendEmail.Dtos;

public record EmailDto
{
    public string To { get; set; } = default!;
    public string Subject { get; set; } = default!;
    public string Body { get; set; } = default!;
}