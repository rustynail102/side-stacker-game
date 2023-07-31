import { Err } from "@server/@types/errors"
import { AuthenticationError } from "@server/errors/authenticationError"
import { InternalServerError } from "@server/errors/internalServerError"
import { ValidationError } from "@server/errors/validationError"
import { NextFunction, Request, Response } from "express"
import {
  BackendTerminatedError,
  ConnectionError,
  DataIntegrityError,
  ForeignKeyIntegrityConstraintViolationError,
  NotFoundError,
  NotNullIntegrityConstraintViolationError,
  StatementCancelledError,
  StatementTimeoutError,
  TupleMovedToAnotherPartitionError,
  UniqueIntegrityConstraintViolationError,
} from "slonik"
import { ZodError } from "zod"

/**
 * httpErrorsMiddleware is an Express middleware that handles HTTP errors.
 */
export const httpErrorsMiddleware = (
  error: Err,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  console.error(error.stack) // Log the stack trace for debugging

  // Use the status code from the error, or default to 500
  let status = "statusCode" in error ? error.statusCode : 500
  // Default to [error.message]
  let errorMessages: string[] = [error.message]

  switch (true) {
    case error instanceof NotFoundError:
    case error instanceof DataIntegrityError:
    case error instanceof ForeignKeyIntegrityConstraintViolationError:
    case error instanceof NotNullIntegrityConstraintViolationError:
    case error instanceof UniqueIntegrityConstraintViolationError:
    case error instanceof BackendTerminatedError:
    case error instanceof ConnectionError:
    case error instanceof StatementCancelledError:
    case error instanceof TupleMovedToAnotherPartitionError:
    case error instanceof StatementTimeoutError:
      errorMessages = [error.message]
      break

    case error instanceof ZodError:
      if ("issues" in error) {
        errorMessages = error.issues.map(
          ({ message, path }) => `${path.join(" / ")} - ${message}`,
        )
      }
      break

    case error instanceof ValidationError:
    case error instanceof AuthenticationError:
    case error instanceof InternalServerError:
      if ("errors" in error) {
        errorMessages = error.errors.map((error) =>
          typeof error === "string" ? error : error.message,
        )
      }
      break
  }

  switch (true) {
    case error instanceof ZodError:
      status = 400
      break

    case error instanceof NotFoundError:
      status = 404
      break

    case error instanceof DataIntegrityError:
    case error instanceof ForeignKeyIntegrityConstraintViolationError:
    case error instanceof NotNullIntegrityConstraintViolationError:
    case error instanceof UniqueIntegrityConstraintViolationError:
      status = 400
      break

    case error instanceof BackendTerminatedError:
    case error instanceof ConnectionError:
    case error instanceof StatementCancelledError:
    case error instanceof TupleMovedToAnotherPartitionError:
      status = 500
      break

    case error instanceof StatementTimeoutError:
      status = 504
      break
  }

  // Set error status
  res.status(status)

  // Send the error message in the response
  res.json({
    code: status,
    errors: errorMessages,
  })
}
