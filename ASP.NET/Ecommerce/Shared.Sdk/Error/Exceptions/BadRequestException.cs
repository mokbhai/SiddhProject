namespace Shared.Sdk.Error.Exceptions;

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message)
    {
    }
}