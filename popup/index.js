function generateHistoryEntry(entry) {
  const historyTemplate = `
  <div id="${entry.timestamp}">
    <div class="header">
      <span class="timeCopied"></span>
      <a class="urlbtn headerbtn" href="${entry.url}">http</a>
      <button class="delbtn headerbtn" id="del-${entry.timestamp}">X</button>
    </div>
    <div class="body">
      <span class="preview">${entry.content.substring(0, 50)}</span>
    </div>
  </div>
  `

  return historyTemplate
}

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

  chrome.runtime.sendMessage({request: "getHistory"}, (response) => {
    const history = response
    console.log("got history: " + JSON.stringify(history))
    history.forEach(entry => {
      const entryHtml = generateHistoryEntry(entry)
      $("#historyFeed").prepend(entryHtml)
    });
  })

  $("#clearHistoryBtn").on("click", function() {
    chrome.runtime.sendMessage({request: "clearHistory"})
  })

  $(document).on("click", ".urlbtn", function() {
    console.log("button clicked, redirecting to: " + $(this).attr('href'))
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  })

  $(document).on("click", ".delbtn", function() {
    const idToDelete = $(this).attr("id").replace("del-", "")
    console.log("deleting: " + idToDelete)
    $("#" + idToDelete).remove()
    chrome.runtime.sendMessage({"deleteFromHistory": idToDelete})
  })
})