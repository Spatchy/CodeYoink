const defaultSettings = {
  modifier: "none"
}

// handle incoming messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.request == "getSettings") {
    let settingsToSend
    chrome.storage.sync.get('settings', (data) => {
      if(Object.keys(data).length === 0) {
        chrome.storage.sync.set({settings: defaultSettings})
        settingsToSend = defaultSettings
      } else {
        settingsToSend = data.settings
      }
      sendResponse(settingsToSend)
    })
    return true
  }

  if(msg.request == "changeSettings") {
    chrome.storage.sync.set({settings: msg.payload})
    // propagate msg to content-scripts on all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach( tab => {
        console.log(tab.id)
        chrome.tabs.sendMessage(tab.id, msg)
      }) 
    });
  }

  if(msg.request == "newYoink") {
    chrome.storage.sync.get("history", (data) => {
      if(Object.keys(data).length === 0) {
        chrome.storage.sync.set({history: [msg.payload]})
      } else {
        const entriesArr = data.history
        entriesArr.push({}[msg.timestamp] = msg.payload)
        chrome.storage.sync.set({history: entriesArr})
      }
    })
    return true
  }

  if(msg.request == "getHistory") {
    chrome.storage.sync.get("history", (data) => {
      if(Object.keys(data).length === 0) {
        sendResponse([])
      } else {
        sendResponse(data.history)
      }
    })
    return true
  }

  if(msg.request == "clearHistory") {
    chrome.storage.sync.clear()
  }

  if(msg.request == "deleteFromHistory") {
    chrome.storage.sync.get("history", data => {
      const entriesArr = data.history
      entriesArr.splice(entriesArr.findIndex(x => x.timestamp === msg.target), 1)
      chrome.storage.sync.set({history: entriesArr})
    })
    return true
  }
})



