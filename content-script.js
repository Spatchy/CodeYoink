const modifier = "alt"

function isModifierHeld(evt) {
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