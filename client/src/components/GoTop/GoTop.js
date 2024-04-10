import React, { useEffect, useState } from 'react'
import './goTop.css'
const GoTop = () => {
    const [go,setGo] = useState(true);
    const [isFirstGoIn,setIsFirstGoIn] = useState(false)
    useEffect(()=>{
        const displayOnScroll = ()=>{
            if( document.documentElement.scrollTop> (18*document.scrollingElement.scrollHeight/100)){
                setGo(false)
                setIsFirstGoIn(true)
    
            }else{
                setGo(true)
            }
        }
        window.addEventListener("scroll",displayOnScroll)
        return ()=>{
            window.removeEventListener("scroll",displayOnScroll)
        }
    },[go,isFirstGoIn])
  return (
    <div
        className={`gotop ${go?(isFirstGoIn?"gotop__slideout":""):"gotop__slidein"}`}
        onClick={()=>{
            window.scrollTo({
                top:0,
                behavior:'smooth',

            });
        }}
    >
       <p className='gotop__content'>Back to Top</p>
    </div>
  )
}

export default GoTop