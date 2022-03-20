let ALERT_TIMER;
let TIME_OUT;
function GenerateAlertBox(type, message) {
  element = document.getElementById("page-alert")

  if (element.style.display == "flex") {
    clearInterval(ALERT_TIMER);
    clearTimeout(TIME_OUT);
  }

  if (type != "") {
    element.style.opacity = 1;
    document.getElementsByTagName("h3").namedItem("alert-text").innerHTML = message;
    element.style.display = "flex";

    
    if (type.toLowerCase() == "message") {
      document.getElementById("alert").style.backgroundColor = "rgb(18, 143, 163, 0.65)";
      document.getElementById("alert").style.border = "2px solid rgb(18, 143, 163, 0.65)";
    } else if (type.toLowerCase() != "success")  {
      document.getElementById("alert").style.backgroundColor = "rgba(211, 10, 10, 0.85)";
      document.getElementById("alert").style.border = "2px solid rgba(211, 10, 10, 0.85)";
    }

    TIME_OUT = setTimeout(function () { AlerFadeOut(element); }, 4000);
  }
}

function ClearAlertMessage(element) {
  clearInterval(ALERT_TIMER);
  clearTimeout(TIME_OUT);
  element.style.display = "none";
}

function AlerFadeOut(element) {
  var op = 1;  // initial opacity
  ALERT_TIMER = setInterval(function () {

    if (op <= 0.01) {
      clearInterval(ALERT_TIMER);
      element.style.display = "none";
    }
    element.style.opacity = op;
    op -= 0.01;
  }, 25);
}