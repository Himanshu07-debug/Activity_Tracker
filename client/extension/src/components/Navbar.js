/* global chrome */

import { Link } from "react-router-dom";
// import logo from "../assests/Logo.svg";
import { toast } from "react-hot-toast";

const Navbar = (props) => {

    let isLoggedIn = props.isLoggedIn;
    let setIsLoggedIn = props.setIsLoggedIn;

    const API_URL = "https://activity-tracker-server.onrender.com/users/tokens";

    async function handleAuthResponse(response) {

        const data = await response.json();
      
        localStorage.setItem("resource_owner", JSON.stringify(data.resource_owner));
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("access_token", data.token);
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
        }

    }

    async function storeUserDetails(){

      let email = localStorage.getItem("email");
      // console.log(email);

      chrome.storage.local.get("tabTimeObject", async function(dataCont){
        try {
            const dataString = dataCont["tabTimeObject"];
            if (dataString == null) {
                return;
            }

            const data = JSON.parse(dataString);

            const entries = Object.values(data);

            entries.sort((e1, e2) => {
                const e1Seconds = e1['trackedSeconds'] || 0;
                const e2Seconds = e2['trackedSeconds'] || 0;
                return e1Seconds - e2Seconds;
            });

            try {
              const response = await fetch("https://activity-tracker-server.onrender.com/timetrackers/details", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({entries, email}), 
              });
            } catch (err) {
              console.log("Error refreshing token: ", err);
            }
            
        } catch(err) {
            console.log("Error loading table data: ", err);
        }
    });

    }

    return (
        <div className="flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto">

            <Link to="/" className=" text-white font-bold text-2xl" >
                Web Activity Tracker
            </Link>

            <div className="flex items-center gap-x-4">
                {
                    !isLoggedIn && 
                    <Link to="/login">
                        <button className="bg-[#2F363C] text-[#DADDE2] py-[6px] px-[12px] rounded-[8px] border border-[#474E54]">
                            Log in
                        </button>
                    </Link>
                }
                {
                    !isLoggedIn &&
                    <Link to="/signup">
                        <button className="bg-[#2F363C] text-[#DADDE2] py-[6px] px-[12px] rounded-[8px] border border-[#474E54]" >
                            Sign up</button>
                    </Link>
                }
                {   
                    isLoggedIn &&
                    <Link to="/">
                        <button onClick={ () => {            
                            storeUserDetails();
                            resetTokens();
                            userSession();
                            toast.success("Logged Out");
                        } } 
                        className="bg-[#2F363C] text-[#DADDE2] py-[6px] px-[12px] rounded-[8px] border border-[#474E54]"
                        >Log Out</button>
                    </Link>
                }
                {
                    isLoggedIn && (
                      <a href="https://main--activitytrackerpersonalizeddashboard.netlify.app/" target="_blank">
                        <button className="bg-[#2F363C] text-[#DADDE2] py-[6px] px-[12px] rounded-[8px] border border-[#474E54]">
                                Dashboard
                        </button>
                      </a>
                    )
                    
                }
            </div>


        </div>
    )
}

export default Navbar;

