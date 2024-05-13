import React, { useState } from 'react'
import "./signIn.css"
import { getAccountEndPoint, login, loginEndpoint } from '../../api/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSWRConfig } from 'swr'

const Signin = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [signinErr, setSigninErr] = useState({
    email:"",
    password:"",
    status: ""
  })
  const {mutate} = useSWRConfig()
  
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || "/";

  const submitHandler = async (e) => {
    e.preventDefault()
    const [data,status] = await login([loginEndpoint,email,password])
    if (status === 422) {
      setSigninErr({
        "email":data.error.email?data.error.email:"",
        "password": data.error.password?data.error.password:"",
      })
    } else if (status === 401){
      setSigninErr({
        "email":"",
        "password":"",
        "status": "Wrong email or password"
      })
    } else if (status === 200) {
      mutate(getAccountEndPoint)
      navigate(from, { replace: true });
    } else  {
      console.error(data.error)
    }
  }

  return (
    <div className='signin'>
        <div className='signin__box'>
            <div className='signin__content'>
                <h2 className='signin__title'>Sign in</h2>
                {signinErr.status !== ""?<div className="signin__error">{signinErr.status}</div>:""}
                <h5>Email</h5>
                <input className='signin__input' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                {signinErr.email !== ""?<div className="signin__error">email {signinErr.email}</div>:""}
                <div className='signin__label'>
                  <h5>Password</h5>
                  <a href='password/reset' className='signin__passwordreset'>Forgot your password?</a>
                </div>
                <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} className='signin__input'/>
                {signinErr.password !== ""?<div className="signin__error">password {signinErr.password}</div>:""}
                <button className='signin_submit' onClick={submitHandler}>Sign in</button>
                
                <div className='signin_bottom'>
                    <p className='signin_text'>New to IMDB? <a href='/signup'>Sign up</a></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Signin