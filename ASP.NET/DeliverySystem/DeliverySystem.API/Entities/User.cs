using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DeliverySystem.API.Enums;

namespace DeliverySystem.API.Entities;

public record User : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

    public string UserId { get; set; }
    public string Password { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string EmailId { get; set; } = default!;
    public UserTypeEnum UserType { get; set; } = default!;
}