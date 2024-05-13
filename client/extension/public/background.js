const tabTimeObjectKey = "tabTimeObject";
const lastActiveTabKey = "lastActiveTab";

chrome.runtime.onInstalled.addListener(function(){

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {},
                })],
                actions : [new chrome.declarativeContent.ShowPageAction()]
            }
        ])
    });

});


chrome.windows.onFocusChanged.addListener(function(windowId){

    if(windowId == chrome.windows.WINDOW_ID_NONE){
        processTabChange(false);
    }
    else{
        processTabChange(true);
    }

});


function processTabChange(isWindowActive){

    chrome.tabs.query({'active':true}, function(tabs){
        console.log("windowkey :" + isWindowActive);
        console.log(tabs);

        if(tabs.length > 0 && tabs[0] != null){
            let currentTab = tabs[0];
            let url = currentTab.url;
            let title = currentTab.title;
            let hostName = url;
            try{
                let urlObject = new URL(url);
                hostName = urlObject.hostname;

                chrome.storage.local.get("blockedUrls", function (data) {
                  try {
                      const blockedUrls = data.blockedUrls || []; // Get the array of blocked URLs from storage
                      if (hostName !== "newtab" && blockedUrls.includes(hostName)) {
                          console.log("Blocked URL detected: " + hostName);


                          setTimeout(function () {
                              chrome.tabs.remove(currentTab.id);
                          }, 2000);
                          return;
                      }
                  } catch (err) {
                      console.log("Error checking blocked URLs: ", err);
                  }
              });
          }
          catch (err) {
              console.log(`could not construct url from ${currentTab.url}, error : ${err}`);
          }

            chrome.storage.local.get([tabTimeObjectKey, lastActiveTabKey], function(result){
                let lastActiveTabString = result[lastActiveTabKey];
                let tabTimeObjectString = result[tabTimeObjectKey];
        
                console.log("background.js GET results");
                console.log(result);
        
                tabTimeObject = {};
                if(tabTimeObjectString != null){
                    tabTimeObject = JSON.parse(tabTimeObjectString);
                }
                
                lastActiveTab = {};
                if(lastActiveTabString != null){
                    lastActiveTab = JSON.parse(lastActiveTabString);
                }
        
                if(lastActiveTab.hasOwnProperty("url") && lastActiveTab.hasOwnProperty("lastDataVal")){
                    let lastUrl = lastActiveTab["url"];
                    let currentDataVal_ = Date.now();
                    let passedSeconds = (Date.now() - lastActiveTab["lastDataVal"])*0.001;
        
                    if(tabTimeObject.hasOwnProperty(lastUrl)){
                        let lastUrlObjectInfo = tabTimeObject[lastUrl];
                        if(lastUrlObjectInfo.hasOwnProperty("trackedSeconds")){
                            lastUrlObjectInfo["trackedSeconds"] = lastUrlObjectInfo["trackedSeconds"] + passedSeconds;
                        }
                        else{
                            lastUrlObjectInfo["trackedSeconds"] = passedSeconds;
                        }
                        lastUrlObjectInfo["lastDataVal"] = currentDataVal_;
                    }
                    else{
                        let newUrlInfo = {url: lastUrl, trackedSeconds: passedSeconds, lastDataVal: currentDataVal_, startDateVal: lastActiveTab["lastDataVal"]};
                        tabTimeObject[lastUrl] = newUrlInfo;
                    }
                }
        
                let currentDataValue = Date.now();
                let lastTabInfo = {"url": hostName, "lastDataVal": currentDataValue};
        
                if(!isWindowActive){
                    lastTabInfo = {};
                }
        
                let newLastTabObject = {};
                newLastTabObject[lastActiveTabKey] = JSON.stringify(lastTabInfo);
        
                chrome.storage.local.set(newLastTabObject, function(){
                    console.log("lastActiveTab stored: " + hostName);
                    const tabTimeObjectString = JSON.stringify(tabTimeObject);
                    let newTabTimeObject = {};
                    newTabTimeObject[tabTimeObjectKey] = tabTimeObjectString;
                    chrome.storage.local.set(newTabTimeObject, function(){
                        
                    })
                })
                
            })
        }

        
    })



}

function onTabTrack(activeInfo){
    let tabId = activeInfo.tabId;
    let windowId = activeInfo.windowId;

    processTabChange(true);
}

function nullOrUndefined(itemToCheck) {
    return itemToCheck == null || itemToCheck === "undefined";
}

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

async function userSession() {
    await refreshToken();
    await requestNewAccessToken();
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

  async function userCanAccess() {
    let access_token = localStorage.getItem("access_token");
    if (nullOrUndefined(access_token)) {
      return;
    }
    const response = await fetch(`https://activity-tracker-server.onrender.com/pages/restricted`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
  
    console.log("%c" + data.message, "color: cyan");
    if (data.error) {
      console.log("Error: ", data.error);
      resetTokens();
      userSession();
    }
  }

chrome.tabs.onActivated.addListener(onTabTrack);
  
  (async () => {
    try {
      await userSession();
      console.log("%cUser session complete. Begin application logic", "color: green");
      let resource_owner = localStorage.getItem("resource_owner");
      if (resource_owner) {
        await userCanAccess();
      } else {
        console.log("No user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  })();


  
  

