import { AuthenticationError } from "@server/errors/authenticationError"
import { InternalServerError } from "@server/errors/internalServerError"
import { ValidationError } from "@server/errors/validationError"
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

export type Err =
  | ValidationError
  | AuthenticationError
  | InternalServerError
  | BackendTerminatedError
  | DataIntegrityError
  | ForeignKeyIntegrityConstraintViolationError
  | NotFoundError
  | NotNullIntegrityConstraintViolationError
  | StatementCancelledError
  | StatementTimeoutError
  | TupleMovedToAnotherPartitionError
  | UniqueIntegrityConstraintViolationError
  | ConnectionError
  | ZodError
