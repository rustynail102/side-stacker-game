// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logWsErrorsMiddleware = (err: any) => {
  console.error("Websockets error:")
  console.log(err?.message) // the error message, for example "Session ID unknown"
}
