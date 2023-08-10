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
        try
        {
            await using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var users = await connection.QueryAsync<User>("select * from users");
            return Ok(users);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
        }
    }

    [HttpGet("{userId:int}")]
    public async Task<ActionResult<User>> GetUser(int userId)
    {
        try
        {
            await using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var user = await connection.QueryFirstAsync<User>("select * from users where Id = @UsrId", new { UsrId = userId });
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        try
        {
            await using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("insert into Users (Id, Name, Password, Email) Values (@Id, @Name, @Password, @Email)", user);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
        }
    }

    [HttpPut]
    public async Task<ActionResult<User>> UpdateUser(User user)
    {
        try
        {
            await using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("Update Users set Name = @Name, Password = @Password, Email = @Email where Id = @Id", user);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
        }
    }
    [HttpDelete("{userId:int}")]
    public async Task<ActionResult<User>> DeleteUser(int userId)
    {
        try
        {
            await using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var user = await connection.QueryFirstAsync<User>("delete from User where Id = @UsrId", new { UsrId = userId });
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
        }
    }

}
