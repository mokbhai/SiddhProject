using Ecommerce.Api.Enums;
using Shared.Sdk.Dtos;

namespace Ecommerce.Api.Dtos;

public record ProductDto : BaseDto
{
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Price { get; set; } = default!;
    public CategoryEnum Category { get; set; }
    public string SellerId { get; set; } = default!;
}
