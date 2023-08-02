using Microsoft.AspNetCore.Mvc;

using Shared.Sdk.Error.Exceptions;
using Shared.Sdk.Logger;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

    private readonly ILoggerAdapter<WeatherForecastController> _logger;

    public WeatherForecastController(ILoggerAdapter<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        _logger.LogInfo("Request received by controller:{Controller}, action {ControllerAction}," +
        "Datetime: {Datetime}", nameof(WeatherForecastController), nameof(Get), DateTime.Now.ToString());

        _logger.LogInfo("this is start of weather fore cast");
        _logger.LogDebug("this is start of weather fore cast");
        _logger.LogWarn("this is start of weather fore cast");
        _logger.LogError("this is start of weather fore cast");
        _logger.LogCritical("this is start of weather fore cast");
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}