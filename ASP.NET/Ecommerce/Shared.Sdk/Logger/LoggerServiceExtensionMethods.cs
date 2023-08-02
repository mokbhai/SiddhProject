using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

using Serilog;

namespace Shared.Sdk.Logger;

public static class LoggerServiceExtensionMethods
{
    public static IHostBuilder ConfigureLogging(this IHostBuilder host)
    {
        host.UseSerilog((context, configuration) => configuration.ReadFrom.Configuration(context.Configuration));
        return host;
    }
    public static WebApplication UseLogging(this WebApplication app)
    {
        app.UseSerilogRequestLogging();
        return app;
    }
    public static IServiceCollection AddLogger(this IServiceCollection services)
    {
        services.TryAddTransient(typeof(ILoggerAdapter<>), typeof(LoggerAdapter<>));
        return services;
    }
}
