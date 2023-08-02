using SendEmail.Dtos;

namespace SendEmail.Services;

public interface IEmailService
{
    void SendEmail(EmailDto req);
}