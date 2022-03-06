// handle incoming messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg == "getSettings") {
    chrome.storage.sync.get('settings', (data) => {
      sendResponse(data.settings)
    })
  }
})



