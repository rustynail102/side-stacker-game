import * as argon2 from "argon2"

// PasswordService is responsible for hashing&salting password, and for verifying them
export class PasswordService {
  // Hash and salt a given password with argon2
  static hash = async (password: string) => argon2.hash(password)

  // Verify if provided password would be transformed to the same hash as hash stored in the database
  static verify = async (hash: string, password: string) =>
    argon2.verify(hash, password)
}
