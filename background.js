// handle incoming messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.request == "getSettings") {
    chrome.storage.sync.get('settings', (data) => {
      sendResponse(data.settings)
    })
  }

  if(msg.request == "changeSettings") {
    chrome.storage.sync.set(msg.payload)
  }
})



