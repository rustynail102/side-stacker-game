import { ValidationError } from "@app/errors/validationError"
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
