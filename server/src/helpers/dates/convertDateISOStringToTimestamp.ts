export const convertDateISOStringToTimestamp = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.getTime() / 1000
}
