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
