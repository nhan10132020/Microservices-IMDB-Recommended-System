package main

import (
	"errors"
	"net/http"

	"github.com/nhan10132020/imdb/server/internal/data"
)

func (app *application) insertFavouriteMovieHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MovieID     int64   `json:"movie_id"`
		Title       string  `json:"title"`
		VoteAverage float32 `json:"vote_average"`
		Overview    string  `json:"overview"`
		PosterPath  string  `json:"poster_path"`
		ReleaseDate string  `json:"release_date"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	fav := data.Favourite{
		UserID:      user.ID,
		MovieID:     input.MovieID,
		Title:       input.Title,
		VoteAverage: input.VoteAverage,
		Overview:    input.Overview,
		PosterPath:  input.PosterPath,
		ReleaseDate: input.ReleaseDate,
	}

	err = app.models.Favourites.InsertFavMovie(&fav)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateFavourite):
			app.conflict(w, r, err)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusCreated, envelope{"favourite": fav}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getAllFavouriteMovieHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	favs, err := app.models.Favourites.GetAllUserFavMovie(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"favourites": favs}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getFavouriteMovieByIdHandler(w http.ResponseWriter, r *http.Request) {
	movieId, err := app.readIDParam(r)

	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if movieId <= 0 {
		app.notFoundResponse(w, r)
		return
	}

	user := app.contextGetUser(r)

	fav, err := app.models.Favourites.GetFavouriteMovieById(user.ID, movieId)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"favourite": fav}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) deleteFavouriteMovieByIdHandler(w http.ResponseWriter, r *http.Request) {
	movieId, err := app.readIDParam(r)

	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if movieId <= 0 {
		app.notFoundResponse(w, r)
		return
	}

	user := app.contextGetUser(r)

	err = app.models.Favourites.DeleteUserFavMovie(user.ID, movieId)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "movie successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
