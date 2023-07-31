import { CustomError } from "@server/errors/customError"

/**
 * Custom error class for validation errors.
 */
export class ValidationError extends CustomError {
  constructor(message: string | string[]) {
    super(message, 400)
    this.name = "ValidationError"
  }
}
