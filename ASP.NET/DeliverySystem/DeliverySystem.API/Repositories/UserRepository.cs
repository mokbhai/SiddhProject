using AutoMapper;
using DeliverySystem.API.DbConfig;
using DeliverySystem.API.Dtos.User;
using DeliverySystem.API.Entities;
using DeliverySystem.API.Interfaces.Repository;

namespace DeliverySystem.API.Repositories;

public class UserRepository : IUserRepository
{

    public User LoginUser(string userName, string password)
    {
        using var context = new DeliverySystemDbContext();
        var user = context.Users.FirstOrDefault(x => x.UserName == userName && x.Password == password);
        if (user == null) throw new BadHttpRequestException("UserName or PassWord is Invalid");
        return user;
    }

    public User RegisterUser(User registerUser)
    {
        using var context = new DeliverySystemDbContext();
        registerUser.CreatedAtUtc = DateTime.UtcNow; // Set the CreatedAtUtc property
        registerUser.UpdatedAtUtc = DateTime.UtcNow;
        context.Users.Add(registerUser);
        context.SaveChanges();
        return registerUser;    }
}