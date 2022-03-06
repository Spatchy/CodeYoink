const defaultSettings = {
  modifier: "none"
}

// handle incoming messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.request == "getSettings") {
    let settingsToSend
    chrome.storage.sync.get('settings', (data) => {
      if(Object.keys(data).length === 0) {
        chrome.storage.sync.set(defaultSettings)
        settingsToSend = defaultSettings
      } else {
        settingsToSend = data.settings
      }
      console.log(settingsToSend)
      sendResponse(settingsToSend)
    })
    return true
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



