import React,{useEffect} from 'react'
import './movieList.css'
import {useParams} from 'react-router-dom'
import Card from '../../components/card/Card'
import useSWRInfinite from 'swr/infinite'
import { getMovieList } from '../../api/movieListApi'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getMovieTrending } from '../../api/movieListApi'
import { RotatingLines } from 'react-loader-spinner'
import GoTop from '../../components/GoTop/GoTop'
function MovieList(){
    let {type}=useParams()
    let fetcher = getMovieList
    if(!type){
        type="trending"
        fetcher = getMovieTrending
    }
    function replaceUnderscore(str){
        return str.replace(/_/g, ' ').replace(/\b[a-z]/g, function(letter){
          return letter.toUpperCase();
        });
    }

    const getKey = (pageIndex)=>{
        pageIndex+=1;
        if(type=== "trending"&&pageIndex>1) return null
        if(pageIndex>=6){
            return null;
        }
        return [type,pageIndex]
    }
    const {
        isLoading,
        data: movieList,
        size,
        setSize
    } = useSWRInfinite(getKey,fetcher)

    const isLoadingMore =isLoading || (size > 1 && movieList && typeof movieList[size - 1] === "undefined");
    const isReachingEnd =(movieList && size >=5);

    
    useEffect(()=>{
        const loadMore = ()=>{
            if (Math.ceil(window.innerHeight + document.documentElement.scrollTop)+1  >= document.scrollingElement.scrollHeight && !isReachingEnd) {
                setSize(size+1)
            }
        }
        //console.log(`${window.innerHeight} + ${document.documentElement.scrollTop} = ${Math.ceil(window.innerHeight + document.documentElement.scrollTop)+1 } >=${document.scrollingElement.scrollHeight} && ${isReachingEnd}`)

        window.addEventListener('scroll', loadMore);
        return ()=>{
            window.removeEventListener('scroll',loadMore);
        }
        // eslint-disable-next-line
    },[size])
    
    return (
            <>
            <div className='movie__list'>
                <h2 className='list__title'>{isLoading?<Skeleton width={"180px"} baseColor="#202020" highlightColor="#444"/>:type==="trending"?"Trending":replaceUnderscore(type)}</h2>
                <div className='list__cards'>
                    {
                        isLoading?
                            [...Array(20).keys()].map(i=>(
                                <Card loading key={i}/>
                            ))
                        :
                        movieList?.map(movies=>movies.map(movie=>{
                            return <Card movie={movie} key={movie.id}/>
                        }))
                    }
                </div>
                {isLoadingMore&&(!isReachingEnd||(size>movieList?.length))&&type!=="trending"&&(
                    <div className='loading__state'>
                        <RotatingLines
                            strokeColor="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="40"
                            visible={true}
                        />
                    </div>
                )}
            </div>
            <GoTop/>
            </>
    )
}

export default MovieList