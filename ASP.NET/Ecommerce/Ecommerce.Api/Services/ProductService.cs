using AutoMapper;

using Ecommerce.Api.Dtos;
using Ecommerce.Api.Entities;

using Shared.Sdk.Logger;
using Shared.Sdk.Repositories;
using Shared.Sdk.Services;

namespace Ecommerce.Api.Services;

public interface IProductService
{
    public Task<ProductDto> AddProductAsync(CreateProductDto productDto, CancellationToken cancellationToken = default);
    public Task<ProductDto> UpdateProductAsync(UpdateProductDto productDto, CancellationToken cancellationToken = default);
    public Task<ProductDto> DeleteProductAsync(string id, CancellationToken cancellationToken = default);
    public Task<List<ProductDto>> FilterAsync(ProductFilter productFilter, CancellationToken cancellationToken = default);
    public Task<ProductDto> GetByIdAsync(string id, CancellationToken cancellationToken = default);

}
          
internal class ProductService : BaseService, IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public ProductService(ILoggerAdapter<ProductService> logger, IProductRepository productRepository, IMapper mapper) : base(logger)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }
    public async Task<ProductDto> AddProductAsync(CreateProductDto productDto, CancellationToken cancellationToken = default)
    {
        var productEntity = _mapper.Map<Product>(productDto);
        productEntity = await _productRepository.CreateAsync(productEntity, cancellationToken);
        _logger.LogDebug("Product {ProductId} created successfully", productEntity.Id);
        return _mapper.Map<ProductDto>(productEntity);
    }
    public async Task<ProductDto> UpdateProductAsync(UpdateProductDto productDto, CancellationToken cancellationToken = default)
    {
        var productEntity = _mapper.Map<Product>(productDto);
        productEntity = await _productRepository.UpdateAsync(productEntity, cancellationToken);
        return _mapper.Map<ProductDto>(productEntity);
    }
    public async Task<ProductDto> DeleteProductAsync(string id, CancellationToken cancellationToken = default)
    {
        var productEntity = await _productRepository.SoftDeleteAsync(id, cancellationToken);
        return _mapper.Map<ProductDto>(productEntity);
    }

    public async Task<List<ProductDto>> FilterAsync(ProductFilter productFilter, CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.FilterAsync(productFilter, cancellationToken);
        return _mapper.Map<List<ProductDto>>(products);
    }

    public async Task<ProductDto> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        return _mapper.Map<ProductDto>(product);
    }
}
