
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { currentUser } from "../redux/slice/userSlice";


const ProtectedRoute = () => {
    const user = useSelector(currentUser);

    return user?.accessToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
