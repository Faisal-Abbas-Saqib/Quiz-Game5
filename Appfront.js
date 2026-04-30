fetch("data.json")
  .then(response => response.json())
  .then(data => {
    console.log(data);

    const quest = document.createElement("p");
    const r1    = document.createElement("input");
    const r2    = document.createElement("input");
    const r3    = document.createElement("input");

    r1.setAttribute("type","radio"); r1.setAttribute("name","opt");
    r2.setAttribute("type","radio"); r2.setAttribute("name","opt");
    r3.setAttribute("type","radio"); r3.setAttribute("name","opt");

    const lab1 = document.createElement("label");
    const lab2 = document.createElement("label");
    const lab3 = document.createElement("label");
    const btn  = document.createElement("button");

    btn.innerHTML = "Start Quiz";
    document.getElementById("questionpanel").appendChild(btn);

    let i             = 0;
    let correctanswer = 0;
    let answered      = false;

    /* ── Timer ── */
    const TIMER_SECONDS = 15;
    let timerInterval   = null;
    let timeLeft        = TIMER_SECONDS;

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
          autoAdvance();
        }
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerInterval);
    }

    function updateTimerUI(s) {
      const num  = document.getElementById("timer-num");
      const ring = document.getElementById("pulse-ring");
      const core = document.getElementById("pulse-core");
      if (!num || !ring || !core) return;

      num.textContent = s;
      const color = s > 8 ? "#059669" : s > 4 ? "#d97706" : "#e24b4a";
      num.style.color        = color;
      core.style.borderColor = color;

      if (s <= 5 && s > 0) {
        ring.style.borderColor = color;
        ring.style.animation   = "none";
        void ring.offsetHeight;
        ring.style.animation   = "pulseOut 0.7s ease-out";
      } else {
        ring.style.animation = "none";
        ring.style.opacity   = "0";
      }
    }

    /* ── Called ONLY when timer hits 0, bypasses radio check ── */
    function autoAdvance() {
      if (answered) return;
      answered = true;
      r1.disabled = true; r2.disabled = true; r3.disabled = true;

      const ac = document.getElementById("answerCorrect");
      ac.innerHTML  = "⏱ Time's up!";
      ac.className  = "wrong";

      setTimeout(() => {
        if (i < 5) {
          loadQuestion();          /* go straight to next question */
        } else {
          showResult();
        }
      }, 900);
    }

    /* ── Render a question — single place that updates the DOM ── */
    function loadQuestion() {
      stopTimer();

      quest.style.display = "";
      r1.style.display = ""; lab1.style.display = "";
      r2.style.display = ""; lab2.style.display = "";
      r3.style.display = ""; lab3.style.display = "";

      quest.innerHTML  = (i + 1) + ".  " + data[i].question;
      lab1.innerHTML   = "\u00a0" + data[i].options[0];
      lab2.innerHTML   = "\u00a0" + data[i].options[1];
      lab3.innerHTML   = "\u00a0" + data[i].options[2];

      r1.checked  = false; r2.checked  = false; r3.checked  = false;
      r1.disabled = false; r2.disabled = false; r3.disabled = false;

      document.getElementById("answerCorrect").innerHTML  = "";
      document.getElementById("answerCorrect").className  = "";
      document.getElementById("checkradio_click").innerHTML = "";

      i++;
      btn.innerHTML = i < 5 ? "Next" : "Finish";

      /* ensure elements are inside panel */
      const panel = document.getElementById("questionpanel");
      panel.appendChild(quest);
      panel.appendChild(r1);   panel.appendChild(lab1);
      panel.appendChild(r2);   panel.appendChild(lab2);
      panel.appendChild(r3);   panel.appendChild(lab3);

      startTimer();
    }

    /* ── Result screen ── */
    function showResult() {
      stopTimer();
      document.getElementById("timer-container").style.display = "none";

      quest.style.display  = "none";
      r1.style.display     = "none"; lab1.style.display = "none";
      r2.style.display     = "none"; lab2.style.display = "none";
      r3.style.display     = "none"; lab3.style.display = "none";

      document.getElementById("checkradio_click").innerHTML = "";
      document.getElementById("answerCorrect").innerHTML    = "";

      const score = correctanswer;
      const total = 5;
      const pct   = Math.round((score / total) * 100);
      const grade = score === 5 ? "Perfect score! 🏆"
                  : score >= 4 ? "Great job! 🎉"
                  : score >= 3 ? "Good effort! 👍"
                  : score >= 2 ? "Keep practising 📚"
                  :              "Better luck next time 💪";

      document.getElementById("showresultpanel").innerHTML = `
        <div class="result-box">
          <div class="result-title">Quiz Complete</div>
          <div class="result-score">${score}<span class="result-total">/ ${total}</span></div>
          <div class="result-pct">${pct}%</div>
          <div class="result-bar-track">
            <div class="result-bar-fill" style="width:0%"
                 id="rbar"></div>
          </div>
          <div class="result-grade">${grade}</div>
        </div>`;

      /* animate bar after paint */
      setTimeout(() => {
        const bar = document.getElementById("rbar");
        if (bar) bar.style.width = pct + "%";
      }, 80);

      btn.innerHTML = "Play Again";
    }

    /* ── Button click handler ── */
    btn.addEventListener("click", nextquestion);

    function nextquestion() {
      /* starting fresh */
      if (i === 0) {
        correctanswer = 0;
        document.getElementById("showresultpanel").innerHTML = "";
        loadQuestion();
        return;
      }

      /* between questions: require an answer or time must have expired */
      if (!answered) {
        document.getElementById("checkradio_click").innerHTML = "Please select one option!";
        return;
      }

      /* advance */
      if (i < 5) {
        loadQuestion();
      } else {
        showResult();
      }
    }

    /* ── Answer checkers ── */
    function markAnswer(optionIndex) {
      if (answered) return;
      stopTimer();
      answered = true;
      document.getElementById("checkradio_click").innerHTML = "";

      const correct = data[i - 1].options[optionIndex] === data[i - 1].answer;
      const ac = document.getElementById("answerCorrect");
      if (correct) {
        ac.innerHTML  = "✓ Correct!";
        ac.className  = "correct";
        correctanswer++;
      } else {
        ac.innerHTML  = "✗ Wrong answer";
        ac.className  = "wrong";
      }
      r1.disabled = true; r2.disabled = true; r3.disabled = true;
    }

    r1.addEventListener("click", () => markAnswer(0));
    r2.addEventListener("click", () => markAnswer(1));
    r3.addEventListener("click", () => markAnswer(2));
  });
