function generateHistoryEntry(entry) {
  const historyTemplate = `
  <div id="${entry.timestamp}">
    <div class="header">
      <span class="timeCopied">${timeSince(new Date(entry.timestamp))}</span>
      <span class="controls">
        <button class="urlbtn headerbtn" href="${entry.url}">http</button>
        <button class="delbtn headerbtn" id="del-${entry.timestamp}">X</button>
      </span>
    </div>
    <div class="body">
      <code class="preview">${entry.content.substring(0, 200)}</code>
    </div>
    <div class="footer">
      <div class="footer-content"><i class="fa-solid fa-angle-down"></i></div>
    </div>
  </div>
  `

  return historyTemplate
}

function timeSince(timeStamp) {
  var now = new Date(),
      secondsPast = (now.getTime() - timeStamp.getTime() ) / 1000;
  if(secondsPast < 60){
      return secondsPast + 's';
  }
  if(secondsPast < 3600){
      return parseInt(secondsPast/60) + 'min ago';
  }
  if(secondsPast <= 86400){
      return parseInt(secondsPast/3600) + 'h ago';
  }
  if(secondsPast <= 2628000){
      return parseInt(secondsPast/86400) + 'd ago';
  }
  if(secondsPast <= 31536000){
      return parseInt(secondsPast/2628000) + 'mo ago';
  }
  if(secondsPast > 31536000){
      return parseInt(secondsPast/31536000) + 'y ago';
  }
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
    $("#historyFeed").empty()
    chrome.runtime.sendMessage({request: "clearHistory"})
  })

  $(document).on("click", ".urlbtn", function() {
    console.log("button clicked, redirecting to: " + $(this).attr('href'))
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  })

  $(document).on("click", ".delbtn", function() {
    console.log("delete button clicked")
    const idToDelete = $(this).attr("id").replace("del-", "")
    console.log("deleting: " + idToDelete)
    $("#" + idToDelete).remove()
    chrome.runtime.sendMessage({request: "deleteFromHistory", target: idToDelete})
  })
})