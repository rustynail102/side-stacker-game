import { convertUnixTimestampToDate } from "@app/helpers/dates/convertUnixTimestampToDate"
import { isConvertableToNumber } from "@app/helpers/numbers/isConvertableToNumber"

export const convertObjectToObjectWithIsoDates = <
  K extends PropertyKey,
  V extends string | number,
>(
  obj: Record<K, V>,
  dateFields: Array<K>,
) => {
  const transformedObject = { ...obj }

  dateFields.forEach((dateField) => {
    if (dateField in obj) {
      try {
        const value = obj[dateField]

        if (isConvertableToNumber(value)) {
          const valueAsNumber = Number(value)

          transformedObject[dateField] = convertUnixTimestampToDate(
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
