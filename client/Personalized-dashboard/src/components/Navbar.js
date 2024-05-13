import { Link } from "react-router-dom";
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

    return (
        <div className="flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto">

            <Link to="/" className=" text-white font-bold text-2xl" >
                {/* <img src="./assests/logo.svg" alt="Logo" width={160} height={32} loading="lazy"></img> */}
                Web Activity Tracker
            </Link>

            <div className="flex items-center gap-x-4">

                    <Link to="/about">
                        <button className="bg-[#2F363C] text-[#DADDE2] py-[6px] px-[12px] rounded-[8px] border border-[#474E54]">
                            About
                        </button>
                    </Link>

                {
                    !isLoggedIn && 
                    <Link to="/login">
                        <button className="bg-[#2F363C] text-[#DADDE2] py-[6px] px-[12px] rounded-[8px] border border-[#474E54]">
                            Log in
                        </button>
                    </Link>
                }
                {   
                    isLoggedIn &&
                    <Link to="/">
                        <button onClick={ () => {            
                            // storeUserDetails();
                            resetTokens();
                            userSession();
                            toast.success("Logged Out");
                        } } 
                        className="bg-[#2F363C] text-[#DADDE2] py-[6px] px-[12px] rounded-[8px] border border-[#474E54]"
                        >Log Out</button>
                    </Link>
                }
            </div>


        </div>
    )
}

export default Navbar;

