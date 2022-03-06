chrome.runtime.sendMessage({request: "getSettings"}, (response) => {
  const settings = response

  // listen for incoming messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.request == "changeSettings") {
      settings = message.payload
    }
    return true
  });

  function isModifierHeld(evt) {
    const modifier = settings.modifier
    if(!modifier) {
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

})