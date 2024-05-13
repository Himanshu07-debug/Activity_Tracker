import React from "react";
import Template from "../components/Template";

const Login = ({setIsLoggedIn}) => {
    return (
        <Template
        title="Welcome Back"
        desc1="Do not Forgot to visit our DashBoard Page"
        formType="login"
        setIsLoggedIn={setIsLoggedIn}
        />
    )
}

export default Login;