export class CustomError extends Error {
  statusCode: number
  errors: string[]

  constructor(message: string | string[], statusCode: number) {
    super(typeof message === "string" ? message : message.join(", "))
    this.errors = Array.isArray(message) ? message : [message]
    this.statusCode = statusCode
  }

  get message() {
    return this.errors.join(", ")
  }
}
