import React from 'react'
import './favourite.css'
import Card from '../../components/card/Card.js'
import useSwr, { mutate } from 'swr'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { favouriteEndpoint, getAllFavourite } from '../../api/favourite.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAccountEndPoint } from '../../api/auth.js'

function Favourite(){
    
    const {
        isLoading,
        data: movieList,
        error
    } = useSwr(favouriteEndpoint,getAllFavourite)

    const location = useLocation()
    const navigate = useNavigate()

    if (!isLoading){
        if (error?.status === 401){
            mutate(getAccountEndPoint)
            navigate("/signin", { state: { from: location } })
        }
        if (error?.status === 500){
            navigate("/server/error")
        }
    }


    return (
            <>
            <div className='movie__list'>
                <h2 className='list__title'>{isLoading?<Skeleton width={"180px"} baseColor="#202020" highlightColor="#444"/>:"Favourite"}</h2>
                <div className='list__cards'>
                    {
                        isLoading?
                            [...Array(30).keys()].map(i=>(
                                <Card loading key={i}/>
                            ))
                        :
                        movieList?.length === 0 ? "Your favourite is empty, please add some movie to your favourite!":
                        movieList?.map(movie=>{
                            movie.id = movie.movie_id
                            return <Card movie={movie} key={movie.movie_id}/>
                        })
                    }
                </div>
            </div>
            </>
    )
}


export default Favourite