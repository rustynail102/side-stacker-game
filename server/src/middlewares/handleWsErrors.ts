// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleWsErrors = (err: any) => {
  console.error("Websockets error:")
  console.log(err?.req) // the request object
  console.log(err?.code) // the error code, for example 1
  console.log(err?.message) // the error message, for example "Session ID unknown"
  console.log(err?.context) // some additional error context
}
