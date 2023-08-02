using Ecommerce.Api.Enums;
using FluentValidation;

using Shared.Sdk.Extensions;

namespace Ecommerce.Api.Dtos;

public record CreateProductDto
{
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Price { get; set; } = default!;
    public string Category { get; set; } = default!;
    public string SellerId { get; set; } = default!;
}
public class CreateProductValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductValidator()
    {
        RuleFor(product => product.Name).NotEmpty().WithMessage("Name is required");
        RuleFor(product => product.Description).NotEmpty();
        RuleFor(product => product.Price).GreaterThan(0);
        RuleFor(product => product.Category).NotNull().IsValidEnumValue(typeof(CategoryEnum));
        RuleFor(product => product.SellerId).NotEmpty();
    }
}