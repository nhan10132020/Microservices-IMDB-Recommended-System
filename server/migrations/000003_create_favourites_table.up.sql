CREATE TABLE IF NOT EXISTS favourites (
    user_id bigint NOT NULL REFERENCES users ON DELETE CASCADE,
    movie_id bigint NOT NULL,
    title text NOT NULL,
    vote_average REAL NOT NULL,
    overview text NOT NULL,
    poster_path text NOT NULL,
    release_date text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, movie_id)
);