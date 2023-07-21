ALTER TABLE games 
ADD COLUMN current_player_id UUID REFERENCES players(player_id),
DROP COLUMN number_of_moves;