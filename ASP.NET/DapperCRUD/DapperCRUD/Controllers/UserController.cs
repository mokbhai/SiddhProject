using Dapper;
using IntroDapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DapperCRUD.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IConfiguration _config;

    public UserController(IConfiguration config)
    {
        _config = config;
    }

    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
        using var connction = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        var users = await connction.QueryAsync<User>("select * from users");
        return Ok(users);
    }

    [HttpGet("{UserId}")]
    public async Task<ActionResult<User>> GetUser(int UserId)
    {
        try
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var user = await connection.QueryFirstAsync<User>("select * from users where Id = @UsrId", new { UsrId = UserId });
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
        }
    }
}
