import React from 'react'
import './Header.css'
import {Link } from 'react-router-dom'
import useGetUser from '../../hooks/useGetUser'
import Skeleton from 'react-loading-skeleton'
import { mutate } from 'swr'
import { getAccountEndPoint, logOutEndPoint, logout } from '../../api/auth'

function Header(){
    const { error,isLoading} = useGetUser()

    const logoutFunc = async(e)=>{
        e.preventDefault()
        await logout(logOutEndPoint)
        mutate(getAccountEndPoint)
    }

    return (
        <div className='header'>
            <div className='headerLeft'>
                <Link to='/'><img className='header__icon' src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png' alt="error"/></Link>
                {
                    isLoading? <Skeleton width={"100px"} baseColor="#202020" highlightColor="#444"/>:
                    (
                            <>
                            <Link to='/movies/popular' style={{textDecoration:"none"}}><span>Popular</span></Link>
                            <Link to='/movies/top_rated' style={{textDecoration:"none"}}><span>Top Rated</span></Link>
                            <Link to='/movies/upcoming' style={{textDecoration:"none"}}><span>Upcoming</span></Link>
                            </>
                    )
                }
            </div>
            <div className='headerRight'>
                {
                    isLoading? <Skeleton width={"180px"} baseColor="#202020" highlightColor="#444"/>:
                    error?.status ? (
                            <>
                            <Link to='/signup' style={{textDecoration:"none"}}><span>Sign Up</span></Link>
                            <Link to='/signin' style={{textDecoration:"none"}}><span>Sign In</span></Link>
                            </>
                        ): (
                            <> 
                            <Link to='/favourite' style={{textDecoration:"none"}}><span>Favourite</span></Link>
                            <Link to='/recommend' style={{textDecoration:"none"}}><span>Recommend</span></Link>
                            <button className='headerRight__button'  onClick={logoutFunc}><span>Logout</span></button>
                            </>
                        )
                }
            </div>
        </div>
    )
}


export default Header;