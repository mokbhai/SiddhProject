using AutoMapper;
using DeliverySystem.API.Dtos.User;
using DeliverySystem.API.Entities;
using DeliverySystem.API.Interfaces.Repository;
using DeliverySystem.API.Interfaces.Service;

namespace DeliverySystem.API.Services;

public class UserService : IUserService
{
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;


    public UserService(IMapper mapper, IUserRepository userRepository)
    {
        _mapper = mapper;
        _userRepository = userRepository;
    }

    public UserDto LoginUser(LoginUserDto loginUserDto)
    {
        var userEntity = _userRepository.LoginUser(loginUserDto.UserName, loginUserDto.Password);
        return _mapper.Map<UserDto>(userEntity);
    }

    public UserDto RegisterUser(RegisterUserDto registerUserDto)
    {
        var userEntity = _mapper.Map<User>(registerUserDto);
        userEntity = _userRepository.RegisterUser(userEntity);
        return _mapper.Map<UserDto>(userEntity);
    }
}