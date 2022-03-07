const settings = {}

chrome.runtime.sendMessage({request: "getSettings"}, (response) => {
  Object.assign(settings, response)
  console.log("got settings: " + JSON.stringify(settings))
})

// listen for incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.request == "changeSettings") {
    Object.assign(settings, message.payload)
    console.log("settings changed to " + JSON.stringify(settings))
  }
});

function isModifierHeld(evt) {
  const modifier = settings.modifier
  if(modifier == "none") {
    return true
  } else if(modifier == "ctrl") {
    if(evt.ctrlKey) {
      return true
    }
  } else if(modifier == "shift") {
    if(evt.shiftKey) {
      return true
    }
  } else if(modifier == "alt") {
    if(evt.altKey) {
      return true
    }
  }
  return false
}

$("code").on("click", function (evt) {
  if(isModifierHeld(evt)) {
    console.log("code copied!")
    navigator.clipboard.writeText($(this).text())
  }
})