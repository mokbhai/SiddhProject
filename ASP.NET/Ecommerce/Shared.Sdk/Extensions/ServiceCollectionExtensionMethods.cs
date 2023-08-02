using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

using Shared.Sdk.Error;
using Shared.Sdk.Logger;

using System.Net;

namespace Shared.Sdk.Extensions;

public static class ServiceCollectionExtensionMethods
{
    #region Public

    // Configure the HTTP request pipeline.
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            // Use with Error controller
            app.UseExceptionHandler("/error-development");
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseHsts();
        }
        else
        {
            // Use with Error controller
            app.UseExceptionHandler("/error");
        }
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        return app;
    }     
    
    public static WebApplicationBuilder Configure(this WebApplicationBuilder builder)
    {
        builder.Host.AddHostConfigurations();

        builder.Services.AddConfigurations();
        if (!builder.Environment.IsDevelopment())
        {
            builder.Services.AddHttpsRedirection(options =>
            {
                options.RedirectStatusCode = (int)HttpStatusCode.PermanentRedirect;
                options.HttpsPort = 443;
            });
        }
        return builder;
    }
    #endregion

    #region Private
    private static IServiceCollection AddConfigurations(this IServiceCollection services)
    {
        // Add services to the container.
        services.AddControllers();
        services.AddErrorHandling();
        services.AddControllers().AddNewtonsoftJson(options =>
        {
            options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            options.SerializerSettings.Converters.Add(new StringEnumConverter());
        });
        services.AddLogger();
        return services;
    }     
    private static IHostBuilder AddHostConfigurations(this IHostBuilder services)
    {
        services.ConfigureLogging();
        return services;
    }
  
    #endregion

}
