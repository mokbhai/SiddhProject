using Ecommerce.Api.Dtos;
using Ecommerce.Api.Services;
using Microsoft.AspNetCore.Mvc;

using Shared.Sdk.Error;
using Shared.Sdk.Logger;
using Shared.SDK.Controllers;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : BaseController
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService, ILoggerAdapter<ProductController> logger) : base(logger)
    {
        _productService = productService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateProductDto model)
    {
        var C = ModelState.IsValid;
        ProductDto product = await _productService.AddProductAsync(model);
        _logger.LogDebug("Product {ProductId} created successfully", product.Id);
        return StatusCode(StatusCodes.Status201Created, "User created successfully!");
    }

    [HttpPatch("Update/{id}")]
    public async Task<ProductDto> UpdateProductAsync([FromBody] UpdateProductDto productDto)
    {
        var product = await _productService.UpdateProductAsync(productDto);
        _logger.LogDebug("Product {ProductId} updated successfully", product.Id);
        return product;
    }

    [HttpDelete("DeleteProduct")]
    public async Task<ProductDto> DeleteProductAsync(string id)
    {
        var product = await _productService.DeleteProductAsync(id);
        return product;
    }

    [HttpGet("Filter")]
    public async Task<List<ProductDto>> FilterAsync([FromQuery] ProductFilter productFilter)
    {
        var product = await _productService.FilterAsync(productFilter);
        return product;
    }

    [HttpGet("{id}")]
    public async Task<ProductDto> GetByIdAsync(string id)
    {
        var product = await _productService.GetByIdAsync(id);
        return product;
    }
}
