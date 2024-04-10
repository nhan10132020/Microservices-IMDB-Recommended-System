import React from 'react'
import "./signUp.css"

const SignUp = () => {
  return (
    <div className='signup'>
        <div className='signup__box'>
            <div className='signup__content'>
                <h2 className='signup__title'>Create account</h2>
                <h5>Your name</h5>
                <input className='signup__input' placeholder='First and last name'/>
                <h5>Email</h5>
                <input className='signup__input'/>
                <h5>Password</h5>
                <input className='signup__input' placeholder='at least 8 characters'/>
                <h5>Re-enter password</h5>
                <input className='signup__input'/>
                <button className='signup_submit'>Create your IMDB account</button>
                
                <div className='signup_bottom'>
                    <p className='signup_text'>Already have an account? <a href='/signin'>Sign in</a></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignUp