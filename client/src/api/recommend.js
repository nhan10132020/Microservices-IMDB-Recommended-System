import axios from 'axios'
import { serverHost, serverPort } from '../constants/constants'

const recommendApi = axios.create({
    baseURL:`http://${serverHost}:${serverPort}/v1/`
})

recommendApi.defaults.withCredentials = true

export const recommendEndpoint = "recommend"

// swr usecase
export const getAllRecommend = async(url)=>{
    try {
        const response = await recommendApi.get(`${url}`)
        return response.data.result.recommend_ids
    } catch (err) {
        const error = new Error(err.response.data.error)
        error.info = err.response.data.error
        error.status = err.response.status
        throw error
    }  
}