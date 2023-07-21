ALTER TABLE games 
ADD COLUMN number_of_moves INTEGER NOT NULL DEFAULT 0,
DROP COLUMN current_player_id;