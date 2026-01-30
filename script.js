let sentences = [];
let currentSentence = '';
let startTime;
let score = 0;

// 랭킹 불러오기
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

function updateRankingDisplay() {
  const ol = document.getElementById('rankingList');
  ol.innerHTML = '';
  ranking.forEach((entry, idx) => {
    ol.innerHTML += `<li>${entry.nickname} - ${entry.score}타</li>`;
  });
}

function getLevel(score) {
  if (score >= 400) return "개고수";
  if (score >= 300) return "고수";
  if (score >= 200) return "중수";
  return "ㅈ밥";
}

function addScore(nickname, score) {
  ranking.push({ nickname, score });
  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 10);
  localStorage.setItem('ranking', JSON.stringify(ranking));
  updateRankingDisplay();
}

function loadSentences() {
  fetch('quotes.txt')
    .then(res => res.text())
    .then(text => {
      sentences = text.split('\n').filter(s => s.trim() !== '');
      document.getElementById('sentence').textContent = sentences[0];
      currentSentence = sentences[0];
    });
}

function startGame() {
  const input = document.getElementById('input');
  input.value = '';
  input.focus();
  startTime = new Date().getTime();
}

function checkInput() {
  const input = document.getElementById('input');
  if (input.value === currentSentence) {
    const endTime = new Date().getTime();
    const time = (endTime - startTime) / 1000; // 초
    score = Math.round(currentSentence.length / time * 10); // 임시 점수 계산

    const level = getLevel(score);
    document.getElementById('scoreDisplay').textContent = `점수: ${score}타, 등급: ${level}`;

    // 랭킹 처리
    if (ranking.length < 10 || score > ranking[ranking.length - 1].score) {
      const nickname = prompt("랭킹에 들었습니다! 닉네임을 입력하세요:");
      if (nickname) addScore(nickname, score);
    }

    // 다음 문장 랜덤
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    document.getElementById('sentence').textContent = currentSentence;
    input.value = '';
    startTime = new Date().getTime();
  }
}

// 이벤트
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('input').addEventListener('input', checkInput);

// 초기화
loadSentences();
updateRankingDisplay();
