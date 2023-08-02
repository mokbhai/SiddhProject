using DeliverySystem.API.Dtos.User;

namespace DeliverySystem.API.Interfaces.Service;

public interface IUserService
{
    public UserDto LoginUser(LoginUserDto loginUserDto);
    public UserDto RegisterUser(RegisterUserDto registerUserDto);
}