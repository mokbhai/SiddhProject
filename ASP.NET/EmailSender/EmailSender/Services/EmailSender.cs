using System;
using System.Net;
using System.Net.Mail;

namespace EmailSender.Services;

public class EmailSender
{
    public void SendEmail(string to, string subject, string body)
    {
        // SMTP configuration
        var smtpClient = new SmtpClient("smtp.example.com", 587);
        smtpClient.EnableSsl = true;
        smtpClient.UseDefaultCredentials = false;
        smtpClient.Credentials = new NetworkCredential("your-email@example.com", "your-password");

        // Email message
        var message = new MailMessage();
        message.From = new MailAddress("your-email@example.com");
        message.To.Add(to);
        message.Subject = subject;
        message.Body = body;
        message.IsBodyHtml = true;

        try
        {
            // Send the email
            smtpClient.Send(message);
            Console.WriteLine("Email sent successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Failed to send email: " + ex.Message);
        }
    }
}
