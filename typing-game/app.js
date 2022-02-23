// 변수
const $word = document.querySelector(".section__word");
const $form = document.querySelector('.section__form');
const $input = $form.querySelector('input');

const $score = document.querySelector(".section__score");
const $leftTime = document.querySelector(".section__left-time");
const $myScore = document.querySelector(".section__my-score");

const $currentTime = document.querySelector(".section__left-time span");
const $currentScore = document.querySelector(".section__my-score span");
const $startBtn = document.querySelector(".section__start-btn");

const $result = document.querySelector(".section__result");
const $resultScore = document.querySelector(".section__result-score");

let fullTime = 100;
let maxWords = 3;
let wordsList;
let prevNumber;
let currentScore;
let currentTime;
let timer = null;
let isPlaying = false;

// 초기화
init();

// 함수
function init() {
  $input.addEventListener('input', handleInput);
  $form.addEventListener('submit', handleSubmit);
  $startBtn.addEventListener('click', startGame);
  resetData();
}

function getWords() {
  changeBtn('로딩 중...');
  fetch(`https://random-word-api.herokuapp.com/word?number=${maxWords}`)
    .then(res => res.json())
    .then(res => {
      wordsList = res;
      pickRandomWord();
      changeBtn('게임중');
      timer = setInterval(countDown, 1000);
    });
}

function pickRandomWord() {
  let num = getRandomNumber();
  // 이전 단어와 새 단어가 같으면 다시 뽑기
  if (prevNumber || prevNumber === 0) {
    while (prevNumber === num) {
      num = getRandomNumber();
    }
  }
  console.log(num);
  $word.innerText = wordsList[num];
  prevNumber = num;
  
  function getRandomNumber() {
    const num = Math.floor(Math.random() * (maxWords - 0) + 0);
    return num;
  }
}

function handleSubmit(e) {
  e.preventDefault();
  $input.value = '';
}

function handleInput(e) {
  if (e.target.value.toLowerCase() === $word.innerText.toLowerCase()) getScore(e);
}

function getScore(event) {
  if (!isPlaying) return event.target.value = '';
  currentScore++;
  $currentScore.innerText = currentScore;
  event.target.value = '';
  pickRandomWord();
}

function countDown() {
  currentTime > 0 ? currentTime-- : endGame();
  $currentTime.innerText = currentTime;
}

function startGame() {
  if (isPlaying) return;
  $result.classList.add('section__result--hidden');
  isPlaying = true;
  getWords();
}

function endGame() {
  isPlaying = false;
  $resultScore.innerText = currentScore;
  $result.classList.remove('section__result--hidden');
  resetData();
  clearInterval(timer);
}

function changeBtn(text) {
  $startBtn.innerText = text;
  text === "게임시작"
    ? $startBtn.classList.remove("section__start-btn--loading")
    : $startBtn.classList.add("section__start-btn--loading");
}

function resetData() {
  currentTime = fullTime;
  $currentTime.innerText = currentTime;
  currentScore = 0;
  $currentScore.innerText = currentScore;
  changeBtn('게임시작');
  $word.innerText = "Ready?"
}
