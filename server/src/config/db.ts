let url = process.env.NODE_ENV

switch (process.env.NODE_ENV) {
  case "development":
    url = "postgresql://user:password@localhost:5432/database"
    break

  case "test":
    url = "postgresql://test_user:test_password@localhost:5433/test_database"
    break

  default:
    break
}

/**
 * Configuration settings for the database.
 */
export const dbConfig = {
  url,
}
