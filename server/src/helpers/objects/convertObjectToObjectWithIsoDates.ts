import { convertTimestampToDateISOString } from "@server/helpers/dates/convertTimestampToDateISOString"
import { isConvertableToNumber } from "@server/helpers/numbers/isConvertableToNumber"

/**
 * Converts the specified fields of an object from Unix timestamps to ISO date strings.
 * @param obj - The object to convert.
 * @param dateFields - The keys of the fields to convert.
 * @returns The converted object.
 */
export const convertObjectToObjectWithIsoDates = <
  K extends PropertyKey,
  V extends string | number | null,
>(
  obj: Record<K, V>,
  dateFields: Array<K>,
) => {
  const transformedObject = { ...obj }

  dateFields.forEach((dateField) => {
    if (dateField in obj) {
      try {
        const value = obj[dateField]

        if (value && isConvertableToNumber(value)) {
          const valueAsNumber = Number(value)

          transformedObject[dateField] = convertTimestampToDateISOString(
            valueAsNumber,
          ) as V
        }
      } catch (error) {
        console.error(error)
      }
    }
  })

  return transformedObject as Record<K, string>
}
