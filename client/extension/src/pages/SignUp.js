import React from "react";
import Template from "../components/Template";

const SignUp = ({setIsLoggedIn}) =>{
    return (
        <Template
        title="Join the Activity Tracker for free"
        desc1="Be more Productive at Your work"
        formType="signup"
        setIsLoggedIn={setIsLoggedIn}
        />
    )
}

export default SignUp;