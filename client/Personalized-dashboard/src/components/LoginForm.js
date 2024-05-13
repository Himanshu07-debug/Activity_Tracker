import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const LoginForm = ({setIsLoggedIn}) => {

    const navigate = useNavigate();

    const API_URL = "https://activity-tracker-server.onrender.com/users/tokens";

    const [formData, setFormData] = useState({
        email:"", password:""
    })

    const [showPassword,setShowPassword] = useState(false);

    function changeHandler(event) {
        setFormData( (prevData) => ({
            ...prevData,
            [event.target.name]:event.target.value
        }) )
    }

    function resetTokens() {
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("resource_owner");
        localStorage.removeItem("access_token");
        localStorage.removeItem("email");
      }
      
    async function requestNewAccessToken() {
        let refresh_token = localStorage.getItem("refresh_token");
        if (nullOrUndefined(refresh_token)) {
          return;
        }
        let access_token = localStorage.getItem("access_token");
        if (access_token) {
          return;
        }
        try {
          const response = await fetch(`${API_URL}/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refresh_token}`,
            },
          });
          handleAuthResponse(response);
        } catch (err) {
          console.log("Error refreshing token: ", err);
          resetTokens();
          userSession();
        }
      }


    async function refreshToken() {
        let refresh_token = localStorage.getItem("refresh_token");
        if (nullOrUndefined(refresh_token)) {
          return;
        }
        console.log(refresh_token);
      
        try {
          let response = await fetch(`${API_URL}/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refresh_token}`,
            },
          });
          if (!response.ok) {
            if (response.status === 401) {
            } else {
              throw new Error(response.statusText);
            }
          }
          let data = await response.json();
          console.log("Setting access token to: ", data.token);
          localStorage.setItem("resource_owner", JSON.stringify(data.resource_owner));
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("access_token", data.token);

        } catch (err) {
          console.log("Error refreshing token: ", err);
          resetTokens();
          userSession();
        }
      }

    function nullOrUndefined(itemToCheck) {
        return itemToCheck == null || itemToCheck === "undefined";
    }

    async function userSession() {
        await refreshToken();
        await requestNewAccessToken();
        let access_token = localStorage.getItem("access_token");
        if(nullOrUndefined(access_token)) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
            toast.success("Logged In");
        }

    }

    async function handleAuthResponse(response) {

        const data = await response.json();
      
        localStorage.setItem("resource_owner", JSON.stringify(data.resource_owner));
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("access_token", data.token);
    }

    async function submitHandler(event){
      event.preventDefault();
  
      const response = await fetch(`${API_URL}/sign_in`, {
          method: "POST",
          body: JSON.stringify({
              email : formData.email,
              password : formData.password,
          }),
          headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("email",formData.email);
      await handleAuthResponse(response);
      userSession();
      navigate("/");
  }
  

    return (
        <form onSubmit={submitHandler}
        className="flex flex-col w-full gap-y-2 mt-4"
        >
            <label className="w-full">
                <p className="text-[0.875rem] mb-1 leading-[1.375rem] text-[#d1d4d9]">
                    Email Address<sup className="text-pink-600">*</sup></p>

                <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
                placeholder="Enter email address"
                className="bg-[#2F363C] rounded-[0.5rem] text-[#d1d4d9] w-full p-[12px]"
                />

            </label>

            <label className="w-full relative">
                <p className="text-[0.875rem] mb-1 leading-[1.375rem] text-[#d1d4d9]">
                    Password<sup className="text-pink-600">*</sup></p>

                <input
                required
                type={showPassword ? ("text"):("password")}
                name="password"
                value={formData.password}
                onChange={changeHandler}
                placeholder="Enter Password"
                className="bg-[#2F363C] rounded-[0.5rem] text-[#d1d4d9] w-full p-[12px]"
                />

                <span 
                className="absolute right-3 top-[38px] cursor-pointer"
                onClick={ () => setShowPassword( (prev) => !prev ) }>
                    {showPassword ? 
                    (<AiOutlineEyeInvisible font-size={24} fill='#AFB2BF' />) :
                    (<AiOutlineEye font-size={24} fill='#AFB2BF' />)} 
                </span>

            </label>

            <button className="bg-yellow-400 rounded-[8px] font-medium text-[#010B13] px-[12px] py-[8px] mt-3">
                Sign In
            </button>


        </form>
    )
}

export default LoginForm;

