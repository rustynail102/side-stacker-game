import { ValidationError } from "@app/errors/definitions/validationError"
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

export type Err =
  | Error
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
