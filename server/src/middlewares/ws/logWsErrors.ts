/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * logWsErrorsMiddleware is a middleware that logs WebSocket errors.
 */
export const logWsErrorsMiddleware = (err: any) => {
  console.error("Websockets error:")
  console.log(err?.message) // the error message, for example "Session ID unknown"
}
