import { useLocation, Navigate, Outlet } from "react-router-dom";

import { RotatingLines } from "react-loader-spinner";
import useGetUser from "../../hooks/useGetUser";

const RequireAuth = () => {
    const { error,isLoading} = useGetUser()
    const location = useLocation();

    if (isLoading) {
        return (
            <div className='loading__state'>
                <RotatingLines
                            strokeColor="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="40"
                            visible={true}
                />
            </div>
        )
    }

    if (error?.status) {
        return <Navigate to="/signin" state={{ from: location }} replace />
    } 

    return (
        <Outlet />
    );
}

export default RequireAuth;