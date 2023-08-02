using FluentValidation;

namespace Shared.Sdk.Extensions;

public static class EnumExtensionMethods
{              
    /// <summary>
    /// Validate enum value
    /// </summary>
    /// <param name="enumType"></param>
    /// <returns></returns>
    public static IRuleBuilderOptions<T, string> IsValidEnumValue<T>(this IRuleBuilder<T, string> ruleBuilder, Type enumType)
    {
        var enumValues = enumType.GetEnumValues();
        var enumValueNames = enumValues.Cast<object>().Select(value => value.ToString());
        var enumValuesString = string.Join(", ", enumValueNames);
        return ruleBuilder.Must((rootObject, enumValue, context) =>
        {
            if (Enum.TryParse(enumType, enumValue, out _))
            {
                return true;
            }

            return false;
        }).WithMessage($"Invalid enum value. Allowed values: {enumValuesString}");
    }
}
