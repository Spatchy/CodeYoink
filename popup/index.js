chrome.runtime.sendMessage({request: "getSettings"}, (response) => {
  const settings = response
  $("#modifier_dropdown").val(settings.modifier)

  $("#modifier_dropdown").change(function() {
    settings.modifier = this.value
    chrome.runtime.sendMessage({request: "changeSettings", payload: settings})
  })
})