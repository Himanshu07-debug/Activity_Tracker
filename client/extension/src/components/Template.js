import React from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const Template = ({title,desc1,formType,setIsLoggedIn}) => {
    return (
        <div className="flex w-11/12 max-w-[1160px] mx-auto justify-between items-center gap-x-12 gap-y-0 h-screen">
            <div className="mx-auto">
                <h1 className="text-white font-semibold text-[1.875rem] leading-[2.375rem]">{title}</h1>
                <p className="text-[0.9rem] leading-[1.625rem] mt-2">
                    <span className="text-[#DADDE2]">{desc1}</span>
                </p>

                {formType === "signup" ? 
                (<SignUpForm setIsLoggedIn={setIsLoggedIn}/>):
                (<LoginForm setIsLoggedIn={setIsLoggedIn}/>)}

            </div>

        </div>
    )
}

export default Template;

