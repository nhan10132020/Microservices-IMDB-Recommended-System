import React from 'react'
import './recommend.css'
import Card from '../../components/card/Card.js'
import useSwr, { mutate } from 'swr'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAccountEndPoint } from '../../api/auth.js'
import { getAllRecommend, recommendEndpoint } from '../../api/recommend.js'

function Recommend(){
    
    const {
        isLoading,
        data: movieList,
        error
    } = useSwr(recommendEndpoint,getAllRecommend)

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
                <h2 className='list__title'>{isLoading?<Skeleton width={"180px"} baseColor="#202020" highlightColor="#444"/>:"Recommend"}</h2>
                <div className='list__cards'>
                    {
                        isLoading?
                            [...Array(30).keys()].map(i=>(
                                <Card loading key={i}/>
                            ))
                        :
                        error?.status === 400 ? "Please add at least 3 movies to your favourite for personalized recommendations!":
                        movieList?.map(movie=>{
                            return <Card movie={movie} key={movie.id}/>
                        })
                    }
                </div>
            </div>
            </>
    )
}


export default Recommend