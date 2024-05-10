import axios from 'axios'
import { serverPort } from '../constants/constants'

const authApi = axios.create({
    baseURL:`http://localhost:${serverPort}/v1/`
})

authApi.defaults.withCredentials = true

export const registerEndpoint = "register"
export const loginEndpoint = "authentication"
export const logOutEndPoint = "logout"
export const getAccountEndPoint = "account"

// axios usecase
export const register = async([url,name,email,password,re_password])=>{
    try {
        const response = await authApi.post(`${url}`,{
            name: name,
            email: email,
            password: password,
            re_password: re_password
        })
        return [response.data,response.status]
    } catch (err){
        return [err.response.data, err.response.status]
    }
}

// axios usecase
export const login = async([url,email,password])=>{
    try {
        const response = await authApi.post(`${url}`,{
            email: email,
            password: password,
        })
        return [response.data,response.status]
    } catch (err){
        return [err.response.data, err.response.status]
    }
}

// axios usecase
export const logout = async(url)=>{
    try {
        const response = await authApi.post(`${url}`)
        return [response.data,response.status]
    } catch (err){
        return [err.response.data, err.response.status]
    }
}

// swr usecase
export const getAccount = async(url)=>{
    try {
        const response = await authApi.get(`${url}`)
        return response.data.user
    } catch (err) {
        const error = new Error(err.response.data.error)
        error.info = err.response.data.error
        error.status = err.response.status
        throw error
    }  
}