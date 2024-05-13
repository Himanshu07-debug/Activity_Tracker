import React from "react";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({isLoggedIn, children}) => {

    if(isLoggedIn){        
        return children;
    }

    toast.error("Login First");

    return <Navigate to="/login" />
    
}

export default PrivateRoute;