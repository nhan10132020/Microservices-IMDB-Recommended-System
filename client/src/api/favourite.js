import axios from 'axios'

const favouriteApi = axios.create({
    baseURL:"http://localhost:4000/v1/"
})

favouriteApi.defaults.withCredentials = true

export const favouriteEndpoint = "favourite"

// swr usecase
export const getAllFavourite = async(url)=>{
    try {
        const response = await favouriteApi.get(`${url}`)
        return response.data.favourites
    } catch (err) {
        const error = new Error(err.response.data.error)
        error.info = err.response.data.error
        error.status = err.response.status
        throw error
    }  
}

// swr usecase
export const getByIdFavourite = async([url,id])=>{
    try {
        const response = await favouriteApi.get(`${url}/${id}`)
        return response.data.favourite
    } catch (err) {
        const error = new Error(err.response.data.error)
        error.info = err.response.data.error
        error.status = err.response.status
        throw error
    }  
}

// axios usecase
export const insertFavourite = async([url,movieId,title,voteAverage,overview,posterPath,releaseDate])=>{
    try {
        const response = await favouriteApi.post(`${url}`,{
            "movie_id":movieId,
            "title":title,
            "vote_average": voteAverage,
            "overview" : overview,
            "poster_path": posterPath,
            "release_date" : releaseDate
        })
        return [response.data,response.status]
    } catch (err) {
        return [err.response.data, err.response.status]
    }  
}

// axios usecase
export const deleteByIdFavourite = async([url,id])=>{
    try {
        const response = await favouriteApi.delete(`${url}/${id}`)
        return [response.data,response.status]
    } catch (err) {
        return [err.response.data, err.response.status]
    }  
}