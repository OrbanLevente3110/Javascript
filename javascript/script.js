const questionElement = document.querySelector(".question");
const answersElement = document.querySelector(".answers");
const progressElement = document.querySelector(".progress");
const nextButton = document.querySelector(".next");
const resultElement = document.querySelector(".result");
const restartButton = document.querySelector(".restart");
const scoreElement = document.querySelector(".score");
let questions = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = "";

async function loadQuestions() {
  try {
    const response = await fetch("./questions/questions.json");

    questions = await response.json();
    const shuffledQuestions = questions
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] =
        [shuffledQuestions[j], shuffledQuestions[i]];
    }
    questions = shuffledQuestions;
    showQuestion();
  } catch (error) {
    questionElement.textContent = "Nem sikerült betölteni a kérdéseket.";
    console.error(error);
  }
}

function showQuestion() {

  selectedAnswer = "";
  nextButton.disabled = true;
  resultElement.textContent = "";

  const question = questions[currentQuestion];
  progressElement.textContent = `${currentQuestion + 1} / ${questions.length}. kérdés`;
  scoreElement.textContent = `Pontszám: ${score} / ${questions.length}`;
  questionElement.textContent = question.question;
  answersElement.innerHTML = "";
  const shuffledAnswers = Object.entries(question.answers);

  for (let i = shuffledAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledAnswers[i], shuffledAnswers[j]] =
      [shuffledAnswers[j], shuffledAnswers[i]];
  }

  question.answers = Object.fromEntries(shuffledAnswers);
  let i = 0;
  let letters = ["A","B","C","D","E","F","G"]
  Object.entries(question.answers).forEach(([letter, answer]) => {
    const button = document.createElement("button");
    button.textContent = `${letters[i]}) ${answer}`;
    button.dataset.answer = letter;
    button.type = "button";
    answersElement.append(button);
    i++;
  });
}

answersElement.addEventListener("click", (event) => {
  const clickedButton = event.target.closest("button");
  if (!clickedButton) return;

  selectedAnswer = clickedButton.dataset.answer;
  if (!selectedAnswer) return;
  if (selectedAnswer === questions[currentQuestion].correctAnswer) {
    score++;
    clickedButton.classList.add("correct");
          answersElement.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("incorrect", button !== clickedButton);
    button.classList.remove("selected");
  });
  } else {
    clickedButton.classList.add("incorrect");
      answersElement.querySelectorAll("button").forEach((button) => {
        button.classList.remove("selected");
    button.classList.toggle("incorrect", button.dataset.answer !== questions[currentQuestion].correctAnswer);
    button.classList.toggle("correct", button.dataset.answer === questions[currentQuestion].correctAnswer);
  });

  }
  answersElement.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("selected", button === clickedButton);
  });
  answersElement.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  nextButton.disabled = false;
  scoreElement.textContent = `Pontszám: ${score} / ${questions.length}`;
});

nextButton.addEventListener("click", () => {
  if (!selectedAnswer) return;

  answersElement.querySelectorAll("button").forEach((button) => {
    button.classList.remove("correct", "incorrect", "selected");
    button.disabled = false;
  });
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  questionElement.textContent = "A kvíz véget ért!";
  answersElement.innerHTML = "";
  progressElement.textContent = "";
  scoreElement.textContent = "";
  nextButton.hidden = true;

  const percentage = Math.round((score / questions.length) * 100);
  resultElement.textContent = `Eredmény: ${score} / ${questions.length} helyes válasz (${percentage}%).`;
  restartButton.hidden = false;
}

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  nextButton.hidden = false;
  restartButton.hidden = true;
  showQuestion();
});

loadQuestions();
