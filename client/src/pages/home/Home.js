import React from 'react'
import MovieList from '../movieList/MoveList'
import "./home.css"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import {Link} from 'react-router-dom'
import useSwr from 'swr'
import { getMovieDiscover } from '../../api/movieListApi';
import Skeleton from 'react-loading-skeleton';

function Home(){
    const {
        isLoading,
        data:discoverMovie,
    } = useSwr("discover",getMovieDiscover)

    return (
        <>  
             <div className="poster">
             <Carousel 
                 showThumbs={false}
                 autoPlay={true}
                 transitionTime={3}
                 infiniteLoop={true}
                 showStatus={false}
             >
                 {
                    isLoading?(
                        <Skeleton
                         height="600px"
                         baseColor="#202020" 
                         highlightColor="#444"
                        />
                    ):(
                        discoverMovie.map(movie=>{
                            return (
                                <Link style={{textDecoration:"none",color:'white'}} to={`/movie/${movie.id}`} key={movie.id}>
                                    <div className='posterImage'>
                                        <img src={`https://image.tmdb.org/t/p/original/${movie&&movie.backdrop_path}`}alt="error"/>
                                    </div>
                                    <div className='posterImage__overlay'>
                                        <div className='posterImage__title'>{movie?movie.title:""}</div>
                                        <div className='posterImage__runtime'>
                                            {movie?movie.release_date:""}
                                            <span className='posterImage__rating'>
                                                {movie?movie.vote_average:""}
                                                <i className="uil uil-favorite"></i>{" "}
                                            </span>
                                        </div>
                                        <div className='posterImage__description'>{movie?movie.overview:""}</div>
                                    </div>
                                </Link>
                            )
                        })
                    )
                 }
             </Carousel>
         </div>
         <MovieList/>
        </>
    )
}


export default Home