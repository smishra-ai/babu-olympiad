let questions = [];
let current = 0;
let score = 0;
let timeLeft;
let timer;

const timerEl = document.getElementById("timer");
const setupEl = document.getElementById("setup");
const quizEl = document.getElementById("quiz");
const resultEl = document.getElementById("result");
const questionBox = document.getElementById("questionBox");
const optionsBox = document.getElementById("options");

document.getElementById("startBtn").onclick = startTest;
document.getElementById("nextBtn").onclick = nextQuestion;
document.getElementById("skipBtn").onclick = skipQuestion;

async function startTest() {
  try {
    const qCount = parseInt(document.getElementById("qCount").value);
    const minutes = parseInt(document.getElementById("timeLimit").value);

    // 👇 IMPORTANT: path must match your repo
    const res = await fetch("questions-1.json");

    if (!res.ok) {
      throw new Error("Questions file not found (HTTP " + res.status + ")");
    }

    const data = await res.json();

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid JSON format");
    }

    questions = shuffle(data.questions).slice(0, qCount);

    timeLeft = minutes * 60;
    setupEl.classList.add("hidden");
    quizEl.classList.remove("hidden");

    startTimer();
    loadQuestion();
  } catch (err) {
    alert("Start Test failed ❌\n\n" + err.message);
    console.error(err);
  }
}


function startTimer() {
  timerEl.textContent = formatTime(timeLeft);
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) finishTest();
  }, 1000);
}

function loadQuestion() {
  const q = questions[current];
  questionBox.textContent = `Q${current + 1}. ${q.text}`;
  optionsBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.onclick = () => selectAnswer(i);
    optionsBox.appendChild(div);
  });
}

function selectAnswer(index) {
  if (index === questions[current].answer) score++;
  nextQuestion();
}

function nextQuestion() {
  current++;
  if (current >= questions.length) finishTest();
  else loadQuestion();
}

function skipQuestion() {
  nextQuestion();
}

function finishTest() {
  clearInterval(timer);
  quizEl.classList.add("hidden");
  resultEl.classList.remove("hidden");
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `Time: ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}


