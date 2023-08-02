using DeliverySystem.API.Dtos.User;
using DeliverySystem.API.Entities;
using DeliverySystem.API.Interfaces.Service;
using Microsoft.AspNetCore.Mvc;

namespace DeliverySystem.API.Controllers;

[ApiController]
[Microsoft.AspNetCore.Components.Route("[controller]")]

public class UserController
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("Login")]
    public UserDto LoginUserDto(LoginUserDto loginUserDto)
    {
        var user = _userService.LoginUser(loginUserDto);
        return user;
    }

    [HttpPatch("Register")]
    public UserDto RegisterUser(RegisterUserDto registerUserDto)
    {
        var user = _userService.RegisterUser(registerUserDto);
        return user;
    }
}