import axios from 'axios'

const movieDetailApi = axios.create({
    baseURL:"https://api.themoviedb.org/3"
})

export const movieApiEndpoint = "/movie"

export const getMovieDetailById = async([url,id])=>{
    const response = await movieDetailApi.get(`${url}/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
    return response.data
}