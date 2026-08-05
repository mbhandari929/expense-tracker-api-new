import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function IsMonthlyBudgets(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name: "isMonthlyBudgets",
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (
            typeof value !== "object" ||
            value === null ||
            Array.isArray(value)
          ) {
            return false;
          }

          return Object.entries(value).every(([month, amount]) => {
            const validMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
            const validAmount =
              typeof amount === "number" &&
              Number.isFinite(amount) &&
              amount >= 0;

            return validMonth && validAmount;
          });
        },

        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must contain YYYY-MM keys and non-negative number values`;
        },
      },
    });
  };
}