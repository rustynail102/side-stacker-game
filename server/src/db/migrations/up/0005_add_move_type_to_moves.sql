DO $$ BEGIN
  CREATE TYPE move_type AS ENUM ('X', 'O');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE moves 
ADD COLUMN move_type move_type NOT NULL;