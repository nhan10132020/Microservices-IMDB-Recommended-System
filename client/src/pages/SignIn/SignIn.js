import React from 'react'
import "./signIn.css"

const Signin = () => {
  return (
    <div className='signin'>
        <div className='signin__box'>
            <div className='signin__content'>
                <h2 className='signin__title'>Sign in</h2>
                <h5>Email or mobile phone number</h5>
                <input className='signin__input'/>
                <div className='signin__label'>
                  <h5>Password</h5>
                  <a href='password/reset' className='signin__passwordreset'>Forgot your password?</a>
                </div>
                <input className='signin__input'/>
                <button className='signin_submit'>Sign in</button>
                
                <div className='signin_bottom'>
                    <p className='signin_text'>New to IMDB? <a href='/signup'>Sign up</a></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Signin