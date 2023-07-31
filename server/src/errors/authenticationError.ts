import { CustomError } from "@server/errors/customError"

/**
 * Custom error class for authentication errors.
 */
export class AuthenticationError extends CustomError {
  constructor(message: string | string[], code = 401) {
    super(message, code)
    this.name = "AuthenticationError"
  }
}
