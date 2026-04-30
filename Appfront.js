fetch("data.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);

const quest = document.createElement("p");
const answer = document.createElement("p");
const r1 = document.createElement("input");
const r2 = document.createElement("input");
const r3 = document.createElement("input");

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
var correctanswer = 0;

/* ── Timer (pulse ring, 15 s) ── */
const TIMER_SECONDS = 15;
let timerInterval   = null;
let timeLeft        = TIMER_SECONDS;
let answered        = false;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIMER_SECONDS;
  answered = false;
  updateTimerUI(timeLeft);
  document.getElementById("timer-container").style.display = "flex";

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) { autoAdvance(); }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerUI(s) {
  const num    = document.getElementById("timer-num");
  const ring   = document.getElementById("pulse-ring");
  const core   = document.getElementById("pulse-core");
  if (!num || !ring || !core) return;

  num.textContent = s;

  const color = s > 8 ? "#059669" : s > 4 ? "#d97706" : "#e24b4a";
  num.style.color        = color;
  core.style.borderColor = color;

  /* pulse urgently when ≤ 5 s */
  if (s <= 5 && s > 0) {
    ring.style.borderColor = color;
    ring.style.animation   = "none";
    ring.offsetHeight;
    ring.style.animation   = "pulseOut 0.7s ease-out";
  } else {
    ring.style.animation = "none";
    ring.style.opacity   = "0";
  }
}

function autoAdvance() {
  /* time ran out — count as wrong, show message, move on after 1 s */
  r1.disabled = true; r2.disabled = true; r3.disabled = true;
  const ac = document.getElementById("answerCorrect");
  ac.innerHTML   = "⏱ Time's up!";
  ac.className   = "wrong";

  setTimeout(() => {
    if (i < 5) {
      nextquestion();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult() {
  stopTimer();
  document.getElementById("timer-container").style.display = "none";

  /* hide question elements */
  quest.style.display = "none";
  r1.style.display = "none"; lab1.style.display = "none";
  r2.style.display = "none"; lab2.style.display = "none";
  r3.style.display = "none"; lab3.style.display = "none";

  document.getElementById("checkradio_click").innerHTML = "";
  document.getElementById("answerCorrect").innerHTML    = "";

  const total   = 5;
  const score   = correctanswer;
  const pct     = Math.round((score / total) * 100);
  const grade   = score === 5 ? "Perfect! 🏆" : score >= 4 ? "Great job! 🎉" : score >= 3 ? "Good effort! 👍" : score >= 2 ? "Keep practising 📚" : "Better luck next time 💪";

  document.getElementById("showresultpanel").innerHTML = `
    <div class="result-box">
      <div class="result-title">Quiz Complete</div>
      <div class="result-score">${score}<span class="result-total">/ ${total}</span></div>
      <div class="result-pct">${pct}%</div>
      <div class="result-bar-track"><div class="result-bar-fill" style="width:${pct}%"></div></div>
      <div class="result-grade">${grade}</div>
    </div>`;

  btn.innerHTML = "Play Again";
  btn.style.display = "block";
  i = 0; correctanswer = 0;
}

btn.addEventListener("click", nextquestion);

function nextquestion() {
  if (r1.checked || r2.checked || r3.checked || i === 0) {

    /* reset visibility */
    quest.style.display = "";
    r1.style.display = ""; lab1.style.display = "";
    r2.style.display = ""; lab2.style.display = "";
    r3.style.display = ""; lab3.style.display = "";

    if (i === 0) {
      document.getElementById("showresultpanel").innerHTML = "";
      correctanswer = 0;
    }

    if (i < 5) {
      quest.innerHTML  = (i + 1) + ".  " + data[i].question;
      answer.innerHTML = "Answer:  " + data[i].answer + "<br>";
      lab1.innerHTML   = "  " + data[i].options[0] + "<br>";
      lab2.innerHTML   = "  " + data[i].options[1] + "<br>";
      lab3.innerHTML   = "  " + data[i].options[2] + "<br>";
      i++;

      r1.checked  = false; r2.checked  = false; r3.checked  = false;
      r1.disabled = false; r2.disabled = false; r3.disabled = false;

      document.getElementById("answerCorrect").innerHTML = "";
      document.getElementById("answerCorrect").className = "";
      document.getElementById("checkradio_click").innerHTML = "";

      btn.innerHTML = i < 5 ? "Next" : "Finish";
      btn.style.display = i === 1 ? "block" : "block";

      startTimer();

    } else {
      showResult();
      return;
    }

    document.getElementById("questionpanel").appendChild(quest);
    document.getElementById("questionpanel").appendChild(r1);
    document.getElementById("questionpanel").appendChild(lab1);
    document.getElementById("questionpanel").appendChild(r2);
    document.getElementById("questionpanel").appendChild(lab2);
    document.getElementById("questionpanel").appendChild(r3);
    document.getElementById("questionpanel").appendChild(lab3);

  } else {
    document.getElementById("checkradio_click").innerHTML = "Please select one option!";
  }
}

function disableRadioButtons() {
  r1.disabled = true; r2.disabled = true; r3.disabled = true;
  answered = true;
  stopTimer();
}

r1.addEventListener("click", checkanswer);
function checkanswer() {
  document.getElementById("checkradio_click").innerHTML = "";
  if (r1.checked && data[i-1].options[0] === data[i-1].answer) {
    document.getElementById("answerCorrect").innerHTML  = "✓ Correct!";
    document.getElementById("answerCorrect").className  = "correct";
    correctanswer++;
  } else {
    document.getElementById("answerCorrect").innerHTML  = "✗ Wrong answer";
    document.getElementById("answerCorrect").className  = "wrong";
  }
  disableRadioButtons();
}

r2.addEventListener("click", checkanswer2);
function checkanswer2() {
  document.getElementById("checkradio_click").innerHTML = "";
  if (r2.checked && data[i-1].options[1] === data[i-1].answer) {
    document.getElementById("answerCorrect").innerHTML  = "✓ Correct!";
    document.getElementById("answerCorrect").className  = "correct";
    correctanswer++;
  } else {
    document.getElementById("answerCorrect").innerHTML  = "✗ Wrong answer";
    document.getElementById("answerCorrect").className  = "wrong";
  }
  disableRadioButtons();
}

r3.addEventListener("click", checkanswer3);
function checkanswer3() {
  document.getElementById("checkradio_click").innerHTML = "";
  if (r3.checked && data[i-1].options[2] === data[i-1].answer) {
    document.getElementById("answerCorrect").innerHTML  = "✓ Correct!";
    document.getElementById("answerCorrect").className  = "correct";
    correctanswer++;
  } else {
    document.getElementById("answerCorrect").innerHTML  = "✗ Wrong answer";
    document.getElementById("answerCorrect").className  = "wrong";
  }
  disableRadioButtons();
}

});
