/**
 * Converts an ISO date string to a Unix timestamp.
 * @param isoDate - The ISO date string to convert.
 * @returns The Unix timestamp.
 */
export const convertDateISOStringToTimestamp = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.getTime() / 1000
}
