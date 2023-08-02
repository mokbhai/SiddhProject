using Ecommerce.Api.DbConfig;
using Ecommerce.Api.Dtos;
using Ecommerce.Api.Entities;
using Ecommerce.Api.Services;

using Microsoft.EntityFrameworkCore;

using Shared.Sdk.Logger;

namespace Shared.Sdk.Repositories;

internal interface IProductRepository : IBaseRepository<Product>
{
    public Task<List<Product>> FilterAsync(ProductFilter? productFilter, CancellationToken cancellationToken = default);
}
internal class ProductRepository : BaseRepository<Product, EcommerceDbContext>, IProductRepository
{
    public ProductRepository(ILoggerAdapter<ProductRepository> logger, EcommerceDbContext ecommerceDbContext) : base(logger, ecommerceDbContext) {} 
    
    public async Task<List<Product>> FilterAsync(ProductFilter? productFilter, CancellationToken cancellationToken = default)
    {
        if (productFilter == null)
        {
            return await DbSet.ToListAsync(cancellationToken);
        }

        var query = DbSet.AsQueryable();
        if (!string.IsNullOrWhiteSpace(productFilter.Search))
        {
            query = query.Where(x => x.Name.Contains(productFilter.Search) || x.Description.Contains(productFilter.Search));
        }
        if (productFilter.Category != null)
        {
            query = query.Where(x => x.Category == productFilter.Category);
        }

        return await query.ToListAsync(cancellationToken);
    }
    
}
