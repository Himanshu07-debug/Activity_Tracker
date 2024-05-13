/* global chrome */

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({setIsLoggedIn}) => {

    const navigate = useNavigate();

    const API_URL = "https://activity-tracker-server.onrender.com/users/tokens";

    const [formData,setFormData] = useState({
        email:"",
        password:"",
        confirmpassword:""

    })

    const [showPassword,setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
              // Handle the error, such as redirecting to the login page
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
        if (nullOrUndefined(access_token)) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
            toast.success("Account created");
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
        if(formData.password !== formData.confirmpassword){
            toast.error("Password do not Match");
            return;
        }

        chrome.storage.local.set({"tabTimeObject": "{}"}, function(){
        });

        chrome.storage.local.set({ "blockedUrls": [] }, function() {
          console.log("Blocked URLs cleared.");
        });

        const response = await fetch(`${API_URL}/sign_up`, {
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

        toast.success("Account created");

        console.log("Printing the formData");
        console.log(formData);

        navigate("/");
    }

    return (
        <div className="flex flex-col w-[75%] gap-y-2 mt-3">

            <form onSubmit={submitHandler}>

                <label className="mt-3">
                    <p className="text-[0.875rem] mb-1 leading-[1.375rem] text-[#d1d4d9] mt-2">
                        Email Address<sup className="text-pink-600">*</sup></p>
                    <input
                    required
                    type="email"
                    name="email"
                    onChange={changeHandler}
                    placeholder="Enter Email Address"
                    value={formData.email}
                    className="bg-[#2F363C] rounded-[0.5rem] text-[#d1d4d9] w-full p-[10px]"
                    />
                </label>

                <div className="flex gap-x-4 mt-3">
                    <label className="relative w-full">
                        <p className="text-[0.875rem] mb-1 leading-[1.375rem] text-[#d1d4d9]">
                            Create Password<sup className="text-pink-600">*</sup></p>
                        <input
                        required
                        type={showPassword ? "text":"password"}
                        name="password"
                        onChange={changeHandler}
                        placeholder="Enter Password"
                        value={formData.password}
                        className="bg-[#2F363C] rounded-[0.5rem] text-[#d1d4d9] w-full p-[10px]"
                        />

                        <span 
                        className="absolute right-3 top-[38px] cursor-pointer "
                        onClick={ () => setShowPassword( (prev) => !prev ) }>
                            {showPassword ?
                             <AiOutlineEyeInvisible font-size={22} fill='#AFB2BF' /> : 
                             (<AiOutlineEye font-size={22} fill='#AFB2BF' />)} 
                        </span>

                    </label>


                    <label className="relative w-full">
                        <p className="text-[0.875rem] mb-1 leading-[1.375rem] text-[#d1d4d9]">
                            Confirm Password<sup className="text-pink-600">*</sup></p>
                        <input
                        required
                        type={showConfirmPassword ? ("text"):("password")}
                        name="confirmpassword"
                        onChange={changeHandler}
                        placeholder="Enter Password"
                        value={formData.confirmpassword}
                        className="bg-[#2F363C] rounded-[0.5rem] text-[#d1d4d9] w-full p-[10px]"
                        />

                        <span 
                        className="absolute right-3 top-[38px] cursor-pointer"
                        onClick={ () => setShowConfirmPassword( (prev) => !prev ) }>
                            {showConfirmPassword ?
                             (<AiOutlineEyeInvisible font-size={22} fill='#AFB2BF' />) 
                             : (<AiOutlineEye font-size={22} fill='#AFB2BF' />)} 
                        </span>

                    </label>

                </div>

                <button className="bg-yellow-400 rounded-[8px] font-medium text-[#010B13] px-[10px] py-[8px] w-full mt-6">
                    Create Account
                </button>

            </form>

        </div>
    )
}

export default SignUpForm;

