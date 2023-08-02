using Shared.Sdk.Logger;

namespace Shared.Sdk.Services;

public class BaseService
{
    protected readonly ILoggerAdapter<BaseService> _logger;

    public BaseService(ILoggerAdapter<BaseService> logger)
    {
        _logger = logger;
    }
}
