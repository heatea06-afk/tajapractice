let sentences = [];
let index = 0;
let startTime;
let speeds = [];

const startBtn = document.getElementById("startBtn");
const game = document.getElementById("game");
const currentSentence = document.getElementById("currentSentence");
const nextSentence = document.getElementById("nextSentence");
const input = document.getElementById("typingInput");
const progress = document.getElementById("progress");
const result = document.getElementById("result");

fetch("sentences.txt")
  .then(res => res.text())
  .then(text => {
    sentences = text
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 10);
  });

startBtn.onclick = () => {
  startBtn.style.display = "none";
  game.classList.remove("hidden");
  index = 0;
  speeds = [];
  show();
};

function show() {
  currentSentence.innerText = sentences[index];
  nextSentence.innerText = sentences[index + 1] || "마지막 문장입니다";
  input.value = "";
  input.focus();
  startTime = Date.now();
  progress.innerText = `${index + 1} / ${sentences.length}`;
}

input.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;

  if (input.value !== sentences[index]) return;

  const time = (Date.now() - startTime) / 1000;
  const speed = sentences[index].length / time;
  speeds.push(speed);

  index++;

  if (index < sentences.length) {
    show();
  } else {
    finish();
  }
});

function finish() {
  input.disabled = true;
  const avg =
    speeds.reduce((a, b) => a + b, 0) / speeds.length;

  result.innerText = `평균 타자 속도: ${avg.toFixed(2)} 타/초`;
}
