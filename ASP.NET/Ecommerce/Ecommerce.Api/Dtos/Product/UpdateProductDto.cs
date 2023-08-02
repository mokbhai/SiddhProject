using Ecommerce.Api.Enums;
using FluentValidation;

namespace Ecommerce.Api.Dtos;

public record UpdateProductDto
{
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Price { get; set; } = default!;
    public CategoryEnum Category { get; set; }
}
public class UpdateProductValidator : AbstractValidator<UpdateProductDto>
{
    public UpdateProductValidator()
    {
        RuleFor(product => product.Name).NotEmpty().WithMessage("Name is required");
        RuleFor(product => product.Description).NotEmpty();
        RuleFor(product => product.Price).NotEmpty();
        RuleFor(product => product.Category).NotEmpty();
    }
}