package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)
	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)

	// user's router
	router.HandlerFunc(http.MethodPost, "/v1/register", app.registerUserHandler)
	router.HandlerFunc(http.MethodPost, "/v1/authentication", app.loginUserHandler)
	router.HandlerFunc(http.MethodGet, "/v1/account", app.getAccount)
	router.HandlerFunc(http.MethodPost, "/v1/logout", app.requireAuthenticatedUser(app.logOutHandler))

	// favourite's router
	router.HandlerFunc(http.MethodGet, "/v1/favourite", app.requireAuthenticatedUser(app.getAllFavouriteMovieHandler))
	router.HandlerFunc(http.MethodGet, "/v1/favourite/:id", app.requireAuthenticatedUser(app.getFavouriteMovieByIdHandler))
	router.HandlerFunc(http.MethodPost, "/v1/favourite", app.requireAuthenticatedUser(app.insertFavouriteMovieHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/favourite/:id", app.requireAuthenticatedUser(app.deleteFavouriteMovieByIdHandler))

	// recommend's router
	router.HandlerFunc(http.MethodGet, "/v1/recommend", app.requireAuthenticatedUser(app.recommendMovieHandler))

	return app.recoverPanic(app.enableCORS(app.rateLimit(app.authenticate(router))))
}
