import * as argon2 from "argon2"

/**
 * PasswordService is a class that contains static methods for hashing&salting password, and for verifying them.
 */
export class PasswordService {
  /**
   * Hashes and salts a given password with argon2.
   */
  static hash = async (password: string) => argon2.hash(password)

  /**
   * Verifies if provided password would be transformed to the same hash as hash stored in the database.
   */
  static verify = async (hash: string, password: string) =>
    argon2.verify(hash, password)
}
