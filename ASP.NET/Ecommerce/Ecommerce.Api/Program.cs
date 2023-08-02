using Ecommerce.Api.DbConfig;
using Ecommerce.Api.Options;
using Ecommerce.Api.Services;
using Shared.Sdk.Repositories;
using Shared.Sdk.Extensions;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

#region Configurations
builder.Configure();
builder.Services.Configure<DatabaseConfig>(builder.Configuration.GetSection(OptionsConst.DATABASE_CONFIG));
#endregion


#region FluentValidation
//ValidatorOptions.Global.DefaultRuleLevelCascadeMode = CascadeMode.Stop;
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
#endregion

#region Swagger
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
#endregion

#region Postgres DbContext
builder.Services.AddDbContext<EcommerceDbContext>();
#endregion

#region AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
#endregion

#region Service
builder.Services.AddTransient<IProductService, ProductService>();
#endregion

#region Repository
builder.Services.AddTransient<IProductRepository, ProductRepository>();
#endregion

var app = builder.Build();

app.ConfigurePipeline();

app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.Run();
