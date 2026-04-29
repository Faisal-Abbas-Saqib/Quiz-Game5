fetch("data.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);

const quest   = document.createElement("p");
const answer  = document.createElement("p");
const r1      = document.createElement("input");
const r2      = document.createElement("input");
const r3      = document.createElement("input");

r1.setAttribute("type","radio"); r1.setAttribute("name","opt");
r2.setAttribute("type","radio"); r2.setAttribute("name","opt");
r3.setAttribute("type","radio"); r3.setAttribute("name","opt");

const lab1 = document.createElement("label");
const lab2 = document.createElement("label");
const lab3 = document.createElement("label");
const btn  = document.createElement("button");
btn.innerHTML = "Start the Game";
document.getElementById("questionpanel").appendChild(btn);

let i             = 0;
var correctanswer = "0";

/* ── Timer state ── */
const TIMER_SECONDS = 15;
let timerInterval   = null;
let timeLeft        = TIMER_SECONDS;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIMER_SECONDS;
  updateTimerUI(timeLeft);
  document.getElementById("timer-container").style.display = "flex";

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoFail();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerUI(s) {
  const CIRC     = 2 * Math.PI * 28; // r=28
  const fraction = s / TIMER_SECONDS;
  const arc      = document.getElementById("timer-arc");
  const num      = document.getElementById("timer-num");
  if (!arc || !num) return;

  arc.style.strokeDashoffset = CIRC * (1 - fraction);

  const color = s > 8 ? "#1D9E75" : s > 4 ? "#BA7517" : "#E24B4A";
  arc.style.stroke = color;
  num.textContent  = s;
  num.style.color  = color;
}

function autoFail() {
  /* time ran out — mark wrong, disable options, show message */
  r1.disabled = true; r2.disabled = true; r3.disabled = true;
  document.getElementById("answerCorrect").innerHTML   = "Time's up!";
  document.getElementById("answerCorrect").style.color = "#E24B4A";
}

btn.addEventListener("click", nextquestion);

function nextquestion() {
  if (r1.checked || r2.checked || r3.checked || i === 0) {
    if (i === 0) { document.getElementById("showresultpanel").innerHTML = ""; }

    if (i < 5) {
      quest.innerHTML = (i + 1) + ".  " + data[i].question;
      answer.innerHTML = "Answer:  " + data[i].answer + "<br>";
      lab1.innerHTML = "  " + data[i].options[0] + "<br>";
      lab2.innerHTML = "  " + data[i].options[1] + "<br>";
      lab3.innerHTML = "  " + data[i].options[2] + "<br>";
      i++;
      r1.checked  = false; r2.checked  = false; r3.checked  = false;
      r1.disabled = false; r2.disabled = false; r3.disabled = false;
      document.getElementById("answerCorrect").innerHTML  = "";
      document.getElementById("answerCorrect").style.color = "";
      btn.innerHTML = "Next";
      if (i === 5) btn.innerHTML = "Finish";

      startTimer();

    } else {
      stopTimer();
      document.getElementById("timer-container").style.display = "none";
      btn.innerHTML = "Start Again";
      if (i === 5) {
        document.getElementById("showresultpanel").innerHTML = "Result : " + correctanswer + "/5";
      }
      i = 0; correctanswer = "0";
    }

    document.getElementById("questionpanel").appendChild(quest);
    document.getElementById("questionpanel").appendChild(r1);
    document.getElementById("questionpanel").appendChild(lab1);
    document.getElementById("questionpanel").appendChild(r2);
    document.getElementById("questionpanel").appendChild(lab2);
    document.getElementById("questionpanel").appendChild(r3);
    document.getElementById("questionpanel").appendChild(lab3);
    document.getElementById("answerCorrect").innerHTML = "";

  } else {
    document.getElementById("checkradio_click").innerHTML = "Please select one option!!!";
  }
}

function disableRadioButtons() {
  if (r1.checked || r2.checked || r3.checked) {
    r1.disabled = true; r2.disabled = true; r3.disabled = true;
  }
}

r1.addEventListener("click", checkanswer);
function checkanswer() {
  document.getElementById("checkradio_click").innerHTML = "";
  stopTimer();
  if (r1.checked && data[i-1].options[0] === data[i-1].answer) {
    document.getElementById("answerCorrect").innerHTML  = "Correct answer";
    document.getElementById("answerCorrect").style.color = "#1D9E75";
    correctanswer++;
  } else {
    document.getElementById("answerCorrect").innerHTML  = "Wrong answer";
    document.getElementById("answerCorrect").style.color = "#E24B4A";
  }
  disableRadioButtons();
}

r2.addEventListener("click", checkanswer2);
function checkanswer2() {
  document.getElementById("checkradio_click").innerHTML = "";
  stopTimer();
  if (r2.checked && data[i-1].options[1] === data[i-1].answer) {
    document.getElementById("answerCorrect").innerHTML  = "Correct answer";
    document.getElementById("answerCorrect").style.color = "#1D9E75";
    correctanswer++;
  } else {
    document.getElementById("answerCorrect").innerHTML  = "Wrong answer";
    document.getElementById("answerCorrect").style.color = "#E24B4A";
  }
  disableRadioButtons();
}

r3.addEventListener("click", checkanswer3);
function checkanswer3() {
  document.getElementById("checkradio_click").innerHTML = "";
  stopTimer();
  if (r3.checked && data[i-1].options[2] === data[i-1].answer) {
    document.getElementById("answerCorrect").innerHTML  = "Correct answer";
    document.getElementById("answerCorrect").style.color = "#1D9E75";
    correctanswer++;
  } else {
    document.getElementById("answerCorrect").innerHTML  = "Wrong answer";
    document.getElementById("answerCorrect").style.color = "#E24B4A";
  }
  disableRadioButtons();
}

});
