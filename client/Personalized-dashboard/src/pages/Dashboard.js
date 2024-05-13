import React, { useState } from "react";
import PieChart from "../components/PieChart";

const Dashboard = () =>{

    const [data, setData] = useState(null);

    async function details(){

        let email = localStorage.getItem("email");

        const FetchedTableData = await fetch(`https://activity-tracker-server.onrender.com/timetracke/userWebDetails?email=${email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        if (FetchedTableData.ok) {
            const responseData = await FetchedTableData.json();
            console.log(responseData);
            setData(responseData);
    
        } else {
            console.error("Failed to fetch user details:", FetchedTableData.statusText);
        }
    }



    return (
        <div className="flex justify-center items-center h-screen">
            {
                (data === null) ? (<button className="bg-yellow-400 rounded-[8px] font-medium text-[#010B13] px-[12px] py-[8px] mt-5"
                onClick={details}
                >
                    View Your analytics
                </button>) 
                : (
                    <div className="w-[70vw] h-[80vh] flex justify-center">
                        <PieChart chartData={data} />
                    </div>
                )
            }
        </div>
    )

}

export default Dashboard;