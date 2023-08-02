using Microsoft.Extensions.Logging;

namespace Shared.Sdk.Logger;

public static class LoggerExtensionMethods
{
    #region Information
    public static void LogInfo<T, T0, T1, T2>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1, T2 arg2)
    {
        logger.Log(LogLevel.Information, message, arg0, arg1, arg2);
    }     
    
    public static void LogInfo<T, T0, T1>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1)
    {
        logger.Log(LogLevel.Information, message, arg0, arg1);
    }    
    
    public static void LogInfo<T, T0>(this ILoggerAdapter<T> logger, string message, T0 arg0)
    {
        logger.Log(LogLevel.Information, message, arg0);
    }   
    
    public static void LogInfo<T>(this ILoggerAdapter<T> logger, string message)
    {
        logger.Log(LogLevel.Information, message);
    }    
    
    public static void LogInfo<T>(this ILoggerAdapter<T> logger, string message, params object[] propertyValues)
    {
        logger.Log(LogLevel.Information, message, propertyValues);
    }
    #endregion

    #region Debug
    public static void LogDebug<T, T0, T1, T2>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1, T2 arg2)
    {
        logger.Log(LogLevel.Debug, message, arg0, arg1, arg2);
    }

    public static void LogDebug<T, T0, T1>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1)
    {
        logger.Log(LogLevel.Debug, message, arg0, arg1);
    }

    public static void LogDebug<T, T0>(this ILoggerAdapter<T> logger, string message, T0 arg0)
    {
        logger.Log(LogLevel.Debug, message, arg0);
    }

    public static void LogDebug<T>(this ILoggerAdapter<T> logger, string message)
    {
        logger.Log(LogLevel.Debug, message);
    }

    public static void LogDebug<T>(this ILoggerAdapter<T> logger, string message, params object[] propertyValues)
    {
        logger.Log(LogLevel.Debug, message, propertyValues);
    }
    #endregion

    #region Warning
    public static void LogWarn<T, T0, T1, T2>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1, T2 arg2)
    {
        logger.Log(LogLevel.Warning, message, arg0, arg1, arg2);
    }

    public static void LogWarn<T, T0, T1>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1)
    {
        logger.Log(LogLevel.Warning, message, arg0, arg1);
    }

    public static void LogWarn<T, T0>(this ILoggerAdapter<T> logger, string message, T0 arg0)
    {
        logger.Log(LogLevel.Warning, message, arg0);
    }

    public static void LogWarn<T>(this ILoggerAdapter<T> logger, string message)
    {
        logger.Log(LogLevel.Warning, message);
    }

    public static void LogWarn<T>(this ILoggerAdapter<T> logger, string message, params object[] propertyValues)
    {
        logger.Log(LogLevel.Warning, message, propertyValues);
    }
    #endregion

    #region Error
    public static void LogError<T, T0, T1, T2>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1, T2 arg2)
    {
        logger.Log(LogLevel.Error, message, arg0, arg1, arg2);
    }

    public static void LogError<T, T0, T1>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1)
    {
        logger.Log(LogLevel.Error, message, arg0, arg1);
    }

    public static void LogError<T, T0>(this ILoggerAdapter<T> logger, string message, T0 arg0)
    {
        logger.Log(LogLevel.Error, message, arg0);
    }

    public static void LogError<T>(this ILoggerAdapter<T> logger, string message)
    {
        logger.Log(LogLevel.Error, message);
    }

    public static void LogError<T>(this ILoggerAdapter<T> logger, string message, params object[] propertyValues)
    {
        logger.Log(LogLevel.Error, message, propertyValues);
    }
    #endregion

    #region Critical
    public static void LogCritical<T, T0, T1, T2>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1, T2 arg2)
    {
        logger.Log(LogLevel.Critical, message, arg0, arg1, arg2);
    }

    public static void LogCritical<T, T0, T1>(this ILoggerAdapter<T> logger, string message, T0 arg0, T1 arg1)
    {
        logger.Log(LogLevel.Critical, message, arg0, arg1);
    }

    public static void LogCritical<T, T0>(this ILoggerAdapter<T> logger, string message, T0 arg0)
    {
        logger.Log(LogLevel.Critical, message, arg0);
    }

    public static void LogCritical<T>(this ILoggerAdapter<T> logger, string message)
    {
        logger.Log(LogLevel.Critical, message);
    }

    public static void LogCritical<T>(this ILoggerAdapter<T> logger, string message, params object[] propertyValues)
    {
        logger.Log(LogLevel.Critical, message, propertyValues);
    }
    #endregion

}
