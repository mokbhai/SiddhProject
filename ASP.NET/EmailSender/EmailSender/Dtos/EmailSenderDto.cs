namespace EmailSender.Dtos;

public record EmailSenderDto
{
    public string EmailId { get; set; } = default!;
    public string Body { get; set; } = default!;
}