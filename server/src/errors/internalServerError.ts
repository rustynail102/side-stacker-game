import { CustomError } from "@server/errors/customError"

/**
 * Custom error class for internal server errors.
 */
export class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error", code = 500) {
    super(message, code)
    this.name = "InternalServerError"
  }
}
