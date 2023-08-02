using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MimeKit.Text;

namespace SendEmail.Controllers;

[ApiController]
[Route("api/[controller]")]

public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }
    [HttpPost]
    public IActionResult SendEmail(EmailDto Ebody)
    {
        _emailService.SendEmail(Ebody);
        return Ok();
    }
}