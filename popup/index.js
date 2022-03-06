const settings = {}

chrome.runtime.sendMessage("getSettings", (response) => {
  Object.assign(settings, response)
})

$("#modifier_dropdown").change(function() {
  settings.modifier = this.value
})