import React, { useState } from 'react'
import "./signUp.css"
import { register, registerEndpoint } from '../../api/auth'
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [rePassword,setRePassword] = useState("")
  const [signupErr, setSignupErr] = useState({
    email:"",
    name:"",
    password:"",
    rePassword:""
  })
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault()
    const [data,status] = await register([registerEndpoint,name,email,password,rePassword])
    if (status === 422) {
      setSignupErr({
        "name": data.error.name?data.error.name:"",
        "password": data.error.password?data.error.password:"",
        "email":data.error.email?data.error.email:"",
        "rePassword":data.error.re_password?data.error.re_password:"",
      })
    } else if (status === 202) {
      navigate("/signin")
    }else {
      console.error(data.error)
    }
  }

  return (
    <div className='signup'>
        <div className='signup__box'>
            <div className='signup__content'>
                <h2 className='signup__title'>Create account</h2>
                <h5>Your name</h5>
                <input className='signup__input' value={name} placeholder='First and last name' onChange={(e)=>setName(e.target.value)}/>
                {signupErr.name !== ""?<div className="signup__error">name {signupErr.name}</div>:""}
                <h5>Email</h5>
                <input className='signup__input' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                {signupErr.email !== ""?<div className="signup__error">email {signupErr.email}</div>:""}
                <h5>Password</h5>
                <input type='password' className='signup__input' placeholder='at least 8 characters' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                {signupErr.password !== ""?<div className="signup__error">password {signupErr.password}</div>:""}
                <h5>Re-enter password</h5>
                <input type='password' className='signup__input' value={rePassword} onChange={(e)=>setRePassword(e.target.value)}/>
                {signupErr.rePassword !== ""?<div className="signup__error">password {signupErr.rePassword}</div>:""}
                <button className='signup_submit' onClick={submitHandler}>Create your IMDB account</button>
                <div className='signup_bottom'>
                    <p className='signup_text'>Already have an account? <a href='/signin'>Sign in</a></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignUp