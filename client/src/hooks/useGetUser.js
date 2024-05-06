import { getAccount, getAccountEndPoint } from "../api/auth"
import useSwr from 'swr'

const useGetUser = ()=>{
    const {data,error,isLoading} = useSwr(getAccountEndPoint, getAccount)

    return {
        user: data,
        error,
        isLoading,
    }
}

export default useGetUser