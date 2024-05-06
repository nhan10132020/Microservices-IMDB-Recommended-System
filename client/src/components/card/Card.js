import React from "react"
import "./card.css"
import { Link } from "react-router-dom"
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'


const Card = ({movie,loading}) => {
    function scrollTop(){
        window.scrollTo({
            top:0,
            behavior:'smooth'
        });
    }      

    return <>
        <Link to={!loading&&`/movie/${movie.id}`} style={{textDecoration:"none", color:"white"}} onClick={scrollTop}>
            <div className="cards">
                {
                    loading?(
                        <Skeleton height={"300px"} baseColor="#202020" highlightColor="#444"/>
                        ):(
                           <>
                            <img className="cards__img" src={`https://image.tmdb.org/t/p/original${movie?movie.poster_path:""}`} alt="error" />
                            <div className="cards__overlay">
                                <div className="card__title">{movie?movie.title?movie.title:movie.original_title?movie.original_title:"":""}</div>
                                <div className="card__runtime">
                                    {movie?movie.release_date:""}
                                    <span className="card__rating">{movie?movie.vote_average:""} <i className="uil uil-favorite"></i></span>
                                </div>
                                <div className="card__description">{movie ? movie.overview.slice(0,118)+"..." : ""}</div>
                            </div>
                           </>
                        )
                    
                }
               
            </div>
        </Link>
    </>
}

export default Card