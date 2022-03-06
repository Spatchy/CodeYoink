// handle incoming messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.request == "getSettings") {
    chrome.storage.sync.get('settings', (data) => {
      sendResponse(data.settings)
    })
  }

  if(msg.request == "changeSettings") {
    chrome.storage.sync.set(msg.payload)
    // propagate msg to content-scripts on all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach( tab => {
        chrome.tabs.sendMessage(tab.id, msg)
      }) 
    });
  }
})



