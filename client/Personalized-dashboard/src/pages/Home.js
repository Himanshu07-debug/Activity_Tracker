
import React from "react";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

const Home = (props) =>{

    let isLoggedIn = props.isLoggedIn;

    return (
        <div className="flex justify-center items-center text-white h-screen">
            {
                (isLoggedIn === false) ? 
                (<div className="flex flex-col items-center ">
                    <h1 className="text-5xl">Welcome! Please Login</h1>
                    <Link to="/login">
                        <button className="bg-yellow-400 rounded-[8px] font-medium text-[#010B13] px-[12px] py-[8px] mt-5 text-3xl">
                            Log in
                        </button>
                    </Link>
                </div>) 
                : 
                (
                    <div className="w-full max-w-screen-md flex flex-col justify-center items-center">
                        <Dashboard />
                    </div>
                ) 
            }
        </div>
    )
}

export default Home;

