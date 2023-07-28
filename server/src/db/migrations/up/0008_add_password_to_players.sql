ALTER TABLE players 
ADD COLUMN password TEXT NOT NULL DEFAULT 'some_random_string_that_wont_be_used_for_auth';

ALTER TABLE players 
ALTER COLUMN password DROP DEFAULT;