using Microsoft.Extensions.Logging;

namespace Shared.Sdk.Logger;

/// <summary>
/// A generic interface for logging where the category name is derived from the specified
/// <typeparamref name="TCategoryName"/>The type whose name is used for the logger category name.
/// </summary>
public interface ILoggerAdapter<out TCategoryName>
{
    void Log(LogLevel level, string message);
    void Log<T0>(LogLevel level, string message, T0 arg0);   
    void Log<T0, T1>(LogLevel level, string message, T0 arg0, T1 arg1);
    void Log<T0, T1, T2>(LogLevel level, string message, T0 arg0, T1 arg1, T2 arg2);
    void Log(LogLevel level, string message, params object[] propertyValues);
}

public class LoggerAdapter<TCategoryName> : ILoggerAdapter<TCategoryName>
{
    private readonly ILogger<TCategoryName> _logger;

    public LoggerAdapter(ILogger<TCategoryName> logger)
    {
        _logger = logger;
    }


    public void Log(LogLevel level, string message)
    {
        if(_logger.IsEnabled(level))
        {
            _logger.Log(level, message);
        }
    }

    // Use value type so that no extra memory get allocated to heap (refernce type)
    public void Log<T0>(LogLevel level, string message, T0 arg0)
    {
        // avoid the array allocation and any boxing allocation when the level isn't enabled
        if (_logger.IsEnabled(level))
        {
            _logger.Log(level, message, arg0);
        }
    }

    public void Log<T0, T1>(LogLevel level, string message, T0 arg0, T1 arg1)
    {
        if (_logger.IsEnabled(level))
        {
            _logger.Log(level, message, arg0, arg1);
        }
    }

    public void Log<T0, T1, T2>(LogLevel level, string message, T0 arg0, T1 arg1, T2 arg2)
    {
        if (_logger.IsEnabled(level))
        {
            _logger.Log(level, message, arg0, arg1, arg2);
        }
    }

    public void Log(LogLevel level, string message, params object[] propertyValues)
    {
        if (_logger.IsEnabled(level))
        {
            _logger.Log(level, message, propertyValues);
        }
    }

}
