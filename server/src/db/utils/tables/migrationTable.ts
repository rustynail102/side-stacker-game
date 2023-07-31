import { sql } from "slonik"

/**
 * SQL query to create the migrations table if it does not exist.
 */
export const MigrationsTableInit = sql.unsafe`
    CREATE TABLE IF NOT EXISTS migrations (
    executed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL
    )
`
