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
    chrome.runtime.sendMessage({
      request: "newYoink", 
      payload: {
        timestamp: Date.now(),
        url: location.href,
        content: $(this).text()
      }
    })
    const x = evt.pageX
    const y = evt.pageY

    const yoinkedAlert = `<div class="yoinkedAlert">Yoinked!</div>`
    $("body").append(yoinkedAlert)
    const myYoink = $(".yoinkedAlert")
    myYoink.css("top", y-10)
    myYoink.css("left", x+20)
    
    // start fade out after 2 seconds
    setTimeout(function() {
      myYoink.fadeOut(600)
    }, 2000)
    // remove after fade out complete
    setTimeout(function() {
      myYoink.remove()
    }, 2600)
  }
})