export const convertUnixTimestampToDate = (unixTimestamp: number) =>
  new Date(unixTimestamp).toISOString()
