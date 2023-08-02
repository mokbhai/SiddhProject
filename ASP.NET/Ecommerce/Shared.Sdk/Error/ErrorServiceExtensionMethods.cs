using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace Shared.Sdk.Error;

public static class ErrorServiceExtensionMethods
{
    public static IServiceCollection AddErrorHandling(this IServiceCollection services)
    {
        services.AddSingleton<ProblemDetailsFactory, AppProblemDetailsFactory>();
        return services;
    }
}