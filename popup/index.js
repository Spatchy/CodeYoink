function escape(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateHistoryEntry(entry) {
  const historyTemplate = `
  <div id="${entry.timestamp}">
    <div class="header">
      <span class="timeCopied">${timeSince(new Date(entry.timestamp))}</span>
      <span class="controls">
        <button class="copybtn headerbtn"><i class="fa-solid fa-paste"></i></button>
        <button class="urlbtn headerbtn" href="${entry.url}"><i class="fa-solid fa-link"></i></button>
        <button class="delbtn headerbtn" id="del-${entry.timestamp}"><i class="fa-solid fa-trash-can"></i></button>
      </span>
    </div>
    <div class="body constrained">
      <code class="preview">${escape(entry.content)}</code>
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
      secondsPast = Math.floor((now.getTime() - timeStamp.getTime() ) / 1000)
  if(secondsPast < 60){
      return secondsPast + 's ago'
  }
  if(secondsPast < 3600){
      return parseInt(secondsPast/60) + 'min ago'
  }
  if(secondsPast <= 86400){
      return parseInt(secondsPast/3600) + 'h ago'
  }
  if(secondsPast <= 2628000){
      return parseInt(secondsPast/86400) + 'd ago'
  }
  if(secondsPast <= 31536000){
      return parseInt(secondsPast/2628000) + 'mo ago'
  }
  if(secondsPast > 31536000){
      return parseInt(secondsPast/31536000) + 'y ago'
  }
}

function triggerCopyBtnFeedback(btnObj) {
  $(btnObj).html(`<i class="fa-solid fa-clipboard-check"></i>`)
  $(btnObj).addClass("display-feedback")
  setTimeout(function() {
    $(btnObj).html(`<i class="fa-solid fa-paste"></i>`)
    $(btnObj).removeClass("display-feedback")
  }, 2000)
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
    if($(this).hasClass("confirm-del")) {
      $("#historyFeed").empty()
      chrome.runtime.sendMessage({request: "clearHistory"})
      $(this).removeClass("confirm-del")
      $(this).html("Clear")
    } else {
      $(this).addClass("confirm-del")
      $(this).html("Click to clear history")
    }
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

  $(document).on("click", ".copybtn", function() {
    console.log("copy button clicked")
    const textToCopy = $(this).parent().parent().siblings(".body").children(".preview").text()
    console.log("text to copy: " + textToCopy)
    navigator.clipboard.writeText(textToCopy)
    triggerCopyBtnFeedback(this)
  })

  $(document).on("click", ".body", function() {
    console.log("body clicked")
    const textToCopy = $(this).children(".preview").text()
    navigator.clipboard.writeText(textToCopy)
    const copybtn = $(this).siblings(".header").children(".controls").children(".copybtn")
    console.log($(copybtn).html())
    triggerCopyBtnFeedback(copybtn)
  })

  $(document).on("click", ".footer", function() {
    console.log("footer clicked")
    const body = $(this).siblings(".body")
    if($(this).hasClass("is-expanded")) { // if entry is already expanded
      body.addClass("constrained")
      $(this).children(".footer-content").html(`<i class="fa-solid fa-angle-down"></i>`)
      $(this).removeClass("is-expanded")
    } else { // if entry is not expanded
      body.removeClass("constrained")
      $(this).children(".footer-content").html(`<i class="fa-solid fa-angle-up"></i>`)
      $(this).addClass("is-expanded")
    }
  })
})