using DeliverySystem.API.Dtos.User;
using DeliverySystem.API.Entities;

namespace DeliverySystem.API.Interfaces.Repository;

public interface IUserRepository
{
    public User LoginUser(string userName, string password);
    public User RegisterUser(User user);
    // public User Profle(string userId);
}