using Ecommerce.Api.Enums;

namespace Ecommerce.Api.Dtos;

public record ProductFilter(string? Search, CategoryEnum? Category);