import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useSelector(store=>store.auth);

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }

    return children;
}
export const AuthenticatedUser = ({children}) => {
    const {isAuthenticated} = useSelector(store=>store.auth);

    if(isAuthenticated){
        return <Navigate to="/"/>
    }

    return children;
}

export const AdminRoute = ({children}) => {
    const {user, isAuthenticated, isLoading} = useSelector(store=>store.auth);

    if(isLoading) {
        // Loading spinner ya text
        return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</div>;
    }

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }

    if(!["instructor", "admin"].includes(user?.role)){
        return <Navigate to="/"/>
    }

    return children;
}