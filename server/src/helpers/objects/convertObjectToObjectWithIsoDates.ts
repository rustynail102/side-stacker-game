import { convertTimestampToDateISOString } from "@app/helpers/dates/convertTimestampToDateISOString"
import { isConvertableToNumber } from "@app/helpers/numbers/isConvertableToNumber"

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
