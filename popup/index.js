chrome.runtime.sendMessage({request: "getSettings"}, (response) => {
  const settings = response
  console.log(JSON.stringify(response))
  $("#modifier_dropdown").val(settings.modifier)
  console.log(settings.modifier)

  $("#modifier_dropdown").change(function() {
    settings.modifier = this.value
    chrome.runtime.sendMessage({request: "changeSettings", payload: settings}, (response) => {
      console.log(response)
    })
  })
})