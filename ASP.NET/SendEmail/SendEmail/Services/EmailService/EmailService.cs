using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using SendEmail.Dtos;

namespace SendEmail.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }
    public void SendEmail(EmailDto req)
    {
        var EmailHost = _config.GetSection("EmailHost").Value;
        var EmailPort = _config.GetSection("EmailPort").Value;
        var EUsername = _config.GetSection("EmailUsername").Value;
        var EPassword = _config.GetSection("EmailPassword").Value;
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(EUsername));
        email.To.Add(MailboxAddress.Parse(req.To));
        email.Subject = req.Subject;
        email.Body = new TextPart(TextFormat.Html) { Text = req.Body };
        
        using var smtp = new SmtpClient();
        smtp.Connect(EmailHost, int.Parse(EmailPort), SecureSocketOptions.StartTls);
        smtp.Authenticate(EUsername, EPassword);
        smtp.Send(email);
        smtp.Disconnect(true);
    }
}