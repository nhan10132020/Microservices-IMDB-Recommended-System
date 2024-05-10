package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/nhan10132020/imdb/server/internal/data"
)

type recommendedAIReq struct {
	Fav_movie_ids []int64 `json:"fav_movie_ids"`
}

type recommendAIRes struct {
	Recommend_ids []*data.Recommended `json:"recommend_ids"`
}

func (app *application) recommendMovieHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	// get all user's favourite movies
	favs, err := app.models.Favourites.GetAllUserFavMovie(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	if len(favs) < 3 {
		app.badRequestResponse(w, r, errors.New("user favourite movies must upper 3"))
		return
	}

	// get recommended movie
	var favIds []int64
	for _, val := range favs {
		favIds = append(favIds, val.MovieID)
	}
	req := recommendedAIReq{
		Fav_movie_ids: favIds,
	}
	jsonBody, err := json.Marshal(req)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// Send an HTTP request
	resp, err := http.Post(fmt.Sprintf("http://%s:%d/v1/ai/recommend", app.config.aiHost, app.config.aiPort), "application/json", bytes.NewBuffer(jsonBody))

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// Parse the response JSON
	var responseData recommendAIRes
	err = json.Unmarshal(body, &responseData)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"result": responseData}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
