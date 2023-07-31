/**
 * Converts a Unix timestamp to an ISO date string.
 * @param timestamp - The Unix timestamp to convert.
 * @returns The ISO date string.
 */
export const convertTimestampToDateISOString = (timestamp: number) =>
  new Date(timestamp).toISOString()
