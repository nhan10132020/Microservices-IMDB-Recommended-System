package data

type Recommended struct {
	Id int64 `json:"id"`
	// Adult            bool      `json:"Adult"`
	// BackdropPath     string    `json:"backdrop_path"`
	// GenreIds         string    `json:"genre_ids"`
	// OriginalLanguage string    `json:"original_language"`
	// OriginalTitle    string    `json:"original_title"`
	Title       string  `json:"title"`
	VoteAverage float32 `json:"vote_average"`
	Overview    string  `json:"overview"`
	PosterPath  string  `json:"poster_path"`
	ReleaseDate string  `json:"release_date"`
}
