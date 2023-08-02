namespace Ecommerce.Api.Options;

public record DatabaseConfig
{
    public string PostgresConnectionString { get; set; } = default!;
}
