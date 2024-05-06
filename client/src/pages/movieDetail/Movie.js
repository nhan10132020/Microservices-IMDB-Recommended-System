import React from "react"
import "./movie.css"
import { useParams } from "react-router-dom"
import useSwr, { mutate } from 'swr'
import { getMovieDetailById, movieApiEndpoint } from "../../api/movieDetail"
import Skeleton from "react-loading-skeleton"
import { IoHeart } from "react-icons/io5";
import Tooltip from '@mui/material/Tooltip';
import { deleteByIdFavourite, favouriteEndpoint, getByIdFavourite, insertFavourite } from "../../api/favourite"
import { getAccountEndPoint } from "../../api/auth"
import { useNavigate, useLocation } from "react-router-dom";


const Movie = () => {
    const { id } = useParams()

    const {
        isLoading,
        data: currentMovieDetail
    } = useSwr([movieApiEndpoint,id],getMovieDetailById)

    const location = useLocation()
    const navigate = useNavigate()
   
    const {
        error: favError,
        isLoading: favLoading,
        mutate: favMutate
    } = useSwr(()=>currentMovieDetail?.id ? [favouriteEndpoint,currentMovieDetail.id]:null,getByIdFavourite)

    const addToFavourite = async(e)=>{
        e.preventDefault()
        const [data, status] = await insertFavourite(
            [
                favouriteEndpoint,
                currentMovieDetail.id,
                currentMovieDetail.title,
                currentMovieDetail.vote_average,
                currentMovieDetail.overview,
                currentMovieDetail.poster_path,
                currentMovieDetail.release_date,
            ]
        )

        if (status === 401) {
            mutate(getAccountEndPoint)
            navigate("/signin", { state: { from: location } })

        } else if (status === 201) {
            favMutate()
        } else {
            console.error(data.error)
        }
    }

    const deleteFromFavourite = async(e)=>{
        e.preventDefault()
        const [data, status] = await deleteByIdFavourite(
            [
                favouriteEndpoint,
                currentMovieDetail.id,
            ]
        )

        if (status === 401) {
            mutate(getAccountEndPoint)
            navigate("/signin", { state: { from: location } })
        } else if (status === 200) {
            favMutate()
        } else {
            console.error(data.error)
        }
    }

    return (
        <div className="movie">
        <div className="movie__intro">
            {isLoading?<Skeleton height={"500px"} baseColor="#202020" highlightColor="#444"/>:<img className="movie__backdrop" alt="backdrop" src={currentMovieDetail?.backdrop_path?`https://image.tmdb.org/t/p/original${currentMovieDetail.backdrop_path}`:"https://i.ytimg.com/vi/np4n2DIOKVM/maxresdefault.jpg"} />}
        </div>
        <div className="movie__detail">
            <div className="movie__detailLeft">
                <div className="movie__posterBox">
                    {isLoading?<Skeleton className="movie__poster" height={"350px"} baseColor="#202020" highlightColor="#444"/>:<img className="movie__poster" alt="poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} />}
                </div>
            </div>
            <div className="movie__detailRight">
                <div className="movie__detailRightTop">
                    <div className="movie__name">
                        {currentMovieDetail ? currentMovieDetail.title?currentMovieDetail.title:currentMovieDetail.original_title?currentMovieDetail.original_title:"":""}
                        {favLoading?"":favError?.status?
                            <Tooltip title="Add to your favourites" placement="right-end" className="movie__tooltip">
                                <button onClick={addToFavourite}>
                                    <IoHeart className="movie__fav"/>
                                </button>
                            </Tooltip>:
                            <Tooltip title="Delete your favourite movie" placement="right-end" className="movie__tooltip">
                            <button onClick={deleteFromFavourite}>
                                <IoHeart className="movie__disfav"/>
                            </button>
                            </Tooltip>
                        }
                    </div>
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