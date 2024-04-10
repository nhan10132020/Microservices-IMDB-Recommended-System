import React from "react"
import "./movie.css"
import { useParams } from "react-router-dom"
import useSwr from 'swr'
import { getMovieDetailById, movieApiEndpoint as movieCache } from "../../api/movieDetail"
import Skeleton from "react-loading-skeleton"
const Movie = () => {
    const { id } = useParams()

    const {
        isLoading,
        data: currentMovieDetail
    } = useSwr([movieCache,id],getMovieDetailById)

    return (
        <div className="movie">
        <div className="movie__intro">
            {isLoading?<Skeleton height={"500px"} baseColor="#202020" highlightColor="#444"/>:<img className="movie__backdrop" alt="backdrop" src={currentMovieDetail.backdrop_path?`https://image.tmdb.org/t/p/original${currentMovieDetail.backdrop_path}`:"https://i.ytimg.com/vi/np4n2DIOKVM/maxresdefault.jpg"} />}
        </div>
        <div className="movie__detail">
            <div className="movie__detailLeft">
                <div className="movie__posterBox">
                    {isLoading?<Skeleton className="movie__poster" height={"350px"} baseColor="#202020" highlightColor="#444"/>:<img className="movie__poster" alt="poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} />}
                </div>
            </div>
            <div className="movie__detailRight">
                <div className="movie__detailRightTop">
                    <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                    <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                    <div className="movie__rating">
                        {currentMovieDetail ? currentMovieDetail.vote_average: ""} <i className="fas fa-star" />
                        <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                    </div>  
                    <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                    <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                    <div className="movie__genres">
                        {
                            currentMovieDetail && currentMovieDetail.genres
                            ? 
                            currentMovieDetail.genres.map(genre => (
                                <span className="movie__genre" key={genre.id} id={genre.id}>{genre.name}</span>
                            )) 
                            : 
                            ""
                        }
                    </div>
                </div>
                <div className="movie__detailRightBottom">
                    <div className="synopsisText">Synopsis</div>
                    <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                </div>

            </div>
        </div>
    </div>
    )
}

export default Movie