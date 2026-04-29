fetch("data.json")
.then(res => res.json())
.then(data => {

  const panel = document.getElementById("questionpanel");

  const quest = document.createElement("p");
  const btn = document.createElement("button");

  const radios = [1,2,3].map(() => {
    const r = document.createElement("input");
    r.type = "radio";
    r.name = "opt";
    return r;
  });

  const labels = [1,2,3].map(() => document.createElement("label"));

  btn.textContent = "Start the Game";
  panel.appendChild(btn);

  let i = 0;
  let score = 0;

  btn.addEventListener("click", () => {

    if (!radios.some(r => r.checked) && i !== 0) {
      document.getElementById("checkradio_click").innerHTML = "Please select one option!";
      return;
    }

    document.getElementById("checkradio_click").innerHTML = "";
    document.getElementById("answerCorrect").innerHTML = "";

    if (i < 5) {
      quest.innerHTML = `${i+1}. ${data[i].question}`;

      radios.forEach((r, idx) => {
        r.checked = false;
        r.disabled = false;
        labels[idx].innerHTML = " " + data[i].options[idx] + "<br>";
      });

      i++;
      btn.textContent = (i === 5) ? "Finish" : "Next";

    } else {
      document.getElementById("showresultpanel").innerHTML = `Result: ${score}/5`;
      btn.textContent = "Start Again";
      i = 0;
      score = 0;
    }

    panel.appendChild(quest);
    radios.forEach((r, idx) => {
      panel.appendChild(r);
      panel.appendChild(labels[idx]);
    });
  });

  radios.forEach((r, idx) => {
    r.addEventListener("click", () => {
      const correct = data[i-1].answer;
      const selected = data[i-1].options[idx];

      if (selected === correct) {
        document.getElementById("answerCorrect").innerHTML = "Correct answer";
        score++;
      } else {
        document.getElementById("answerCorrect").innerHTML = "Wrong answer";
      }

      radios.forEach(r => r.disabled = true);
    });
  });

});
