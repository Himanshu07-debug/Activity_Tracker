/* global chrome */


import React, { useState } from "react";

const Home = (props) => {
    let isLoggedIn = props.isLoggedIn;

    const [tableData, setTableData] = useState([]);
    const [blockedUrls, setBlockedUrls] = useState([]);

    const handleLoadData = () => {

        let blockedArr = tableData;
        let table = blockedUrls;

        chrome.storage.local.get("blockedUrls", function(data) {
            try {
                const blockedUrls = data.blockedUrls || []; 
                blockedArr = blockedUrls;
                setBlockedUrls(blockedUrls); 
            } catch(err) {
                console.log("Error loading blocked URLs: ", err);
            }
        });


        chrome.storage.local.get("tabTimeObject", function(dataCont){
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


                table = entries;
                
            } catch(err) {
                console.log("Error loading table data: ", err);
            }

            setTableData(table);
            setBlockedUrls(blockedArr);
        });
    }

    const handleBlockWebsite = (url) => {
        const updatedBlockedUrls = [...blockedUrls, url]; 
        chrome.storage.local.set({ blockedUrls: updatedBlockedUrls }, function(){

        });
    }

    const handleUnblockWebsite = (url) => {
        const updatedBlockedUrls = blockedUrls.filter(u => u !== url);
        chrome.storage.local.set({ blockedUrls: updatedBlockedUrls }, function(){

        });
    }

    return (
        <div className="flex justify-center items-center text-white text-3xl h-screen">
            {
                (isLoggedIn === false) ? (<p>Welcome, Please Login or SignUp</p>) : (
                    <div className="w-full max-w-screen-md flex flex-col justify-center items-center">
                    {tableData.length > 0 && (
                        <table className="border-collapse w-full border border-gray-600 text-sm">
                            <thead>
                                <tr>
                                    <th className="border border-gray-600 px-4 py-2 w-2/5">Url</th>
                                    <th className="border border-gray-600 px-4 py-2 w-1/5">Minutes</th>
                                    <th className="border border-gray-600 px-4 py-2 w-1/5">Tracked Seconds</th>
                                    <th className="border border-gray-600 px-4 py-2 w-1/5">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((urlObject, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-600 px-2 py-1">{urlObject.url}</td>
                                        <td className="border border-gray-600 px-2 py-1">{(urlObject.trackedSeconds / 60).toFixed(2)}</td>
                                        <td className="border border-gray-600 px-2 py-1">{(urlObject.trackedSeconds || 0).toFixed(0)}</td>
                                        <td className="border border-gray-600 px-2 py-1">
                                            {!blockedUrls.includes(urlObject.url) ? (
                                                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleBlockWebsite(urlObject.url)}>Block</button>
                                            ) : (
                                                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleUnblockWebsite(urlObject.url)}>Unblock</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                        <button className="bg-yellow-400 rounded-[8px] font-medium text-[#010B13] px-[12px] py-[8px] mt-5" onClick={handleLoadData}>Load Data</button>
                    </div>
                ) 
            }
        </div>
    )
}

export default Home;
