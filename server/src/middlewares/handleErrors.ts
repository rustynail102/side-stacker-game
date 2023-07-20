import { Err } from "@app/middlewares/@types/handleErrors"
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

export const handleErrorsMiddleware = (
  error: Err,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  console.error(error.stack) // Log the stack trace for debugging

  // Use the status code from the error, or default to 500
  let status = "statusCode" in error ? error.statusCode : 500

  switch (true) {
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
    error: "errors" in error ? error.errors : error.message,
  })
}
