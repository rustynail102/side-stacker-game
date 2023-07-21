export const convertTimestampToDateISOString = (timestamp: number) =>
  new Date(timestamp).toISOString()
