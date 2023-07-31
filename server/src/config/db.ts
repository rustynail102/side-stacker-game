/**
 * Configuration settings for the database.
 */
export const dbConfig = {
  url:
    process.env.NODE_ENV === "development"
      ? "postgresql://user:password@localhost:5432/database"
      : process.env.DB_URL,
}
