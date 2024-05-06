import axios from 'axios'

const movieListApi = axios.create({
    baseURL:"https://api.themoviedb.org/3"
})
const delay = () => new Promise(res => setTimeout(() => res(), 800))

export const getMovieList = async([category,page])=>{
    await delay()
    const response = await movieListApi.get(`/movie/${category}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&page=${page}`)
    return response.data.results
}

export const getMovieDiscover =async()=>{
    await delay()
    const response = await movieListApi.get(`/discover/movie?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
    return response.data.results
}