/**
 * Checks if a value can be converted to a number.
 * @param str - The value to check.
 * @returns True if the value can be converted to a number, false otherwise.
 */
export const isConvertableToNumber = <T>(str: T) => !Number.isNaN(Number(str))
