using AutoMapper;

using Ecommerce.Api.Dtos;
using Ecommerce.Api.Entities;

namespace Ecommerce.Api.Mappers;

public class ProductMapper : Profile
{
    public ProductMapper()
    {
        #region Product

        CreateMap<Product, ProductDto>();
        CreateMap<ProductDto, Product>();
        CreateMap<CreateProductDto, Product>();
        CreateMap<Product, CreateProductDto>();
        CreateMap<UpdateProductDto, Product>();
        CreateMap<Product, UpdateProductDto>();

        #endregion
    }
}
