import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "./UserProvider";

const PrivateRoute= ({children}) => {
    const { authenticated } = useUserContext();

    if(authenticated === true){
        console.log("inside here");
       return children;
    }

    console.log(authenticated);
    console.log("not authenticated");
    return <Navigate to='/'></Navigate>;
}

export default PrivateRoute;