using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
namespace DapperCRUD.Controllers;

    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet("signin-google")]
        public IActionResult ExternalLogin(string returnUrl = null)
        {
            var redirectUrl = Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl });
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return new ChallengeResult(GoogleDefaults.AuthenticationScheme, properties);
        }
        [HttpGet("signin-google-callback")]
        public async Task<IActionResult> ExternalLoginCallback()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!authenticateResult.Succeeded)
            {
                return BadRequest(); // or redirect to an error page
            }
            var claimsIdentity = new ClaimsIdentity(authenticateResult.Principal.Claims, GoogleDefaults.AuthenticationScheme);
            var authProperties = authenticateResult.Properties;
            await HttpContext.SignInAsync(GoogleDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);
            return Redirect(authProperties.RedirectUri);
        }
    }