const question = document.getElementById('question');
const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const timerDisplay = document.getElementById('timer');
const actionButtons = document.getElementById('action-buttons');
const nextQuestionButton = document.getElementById('next-question-button');
const showAnswerButton = document.getElementById('show-answer-button');
const startContainer = document.getElementById('start-container');
const startTimerButton = document.getElementById('start-timer-button');
const answerContainer = document.getElementById('answer-container');
const answerText = document.getElementById('answer-text');

let currentQuestion = {};
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let timerInterval;
let timeLeft = 10;
let timerStarted = false;

let MAX_QUESTIONS = 20;

fetch('./questions.json')
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then((loadedQuestions) => {
        if (!loadedQuestions || !loadedQuestions.results) {
            throw new Error("Invalid JSON structure");
        }

        questions = loadedQuestions.results.map((loadedQuestion) => {
            MAX_QUESTIONS = loadedQuestions.results.length;

            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error("There was an error fetching the questions:", err);
    });

const startGame = () => {
    questionCounter = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        return window.location.assign('../end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    availableQuestions.splice(questionIndex, 1);

    // Reset timer and UI for new question
    resetTimer();
    hideActionButtons();
    showStartButton();
};

const showStartButton = () => {
    startContainer.classList.remove('hidden');
    actionButtons.classList.add('hidden');
    answerContainer.classList.add('hidden');
    timerStarted = false;
};

const hideStartButton = () => {
    startContainer.classList.add('hidden');
};

const showActionButtons = () => {
    actionButtons.classList.remove('hidden');
};

const hideActionButtons = () => {
    actionButtons.classList.add('hidden');
};

const startTimer = () => {
    timeLeft = 10;
    timerDisplay.innerText = timeLeft;
    startContainer.classList.add('hidden');
    timerStarted = true;

    // Show Show Answer button when timer starts
    actionButtons.classList.remove('hidden');
    showAnswerButton.classList.remove('hidden');
    nextQuestionButton.classList.add('hidden');
    answerContainer.classList.add('hidden');

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        // Change timer color when time is running out
        if (timeLeft <= 10) {
            timerDisplay.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // When timer runs out, hide Show Answer button and show it as the only option
            showAnswerButton.classList.remove('hidden');
            nextQuestionButton.classList.add('hidden');
        }
    }, 1000);
};

const resetTimer = () => {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Reset display and remove warning class
    timerDisplay.classList.remove('warning');
    timerDisplay.innerText = '10';
    timerStarted = false;
};

const showAnswer = () => {
    clearInterval(timerInterval);

    // Get the correct answer
    const correctAnswer = currentQuestion['choice' + currentQuestion.answer];
    answerText.innerText = correctAnswer;
    answerContainer.classList.remove('hidden');

    // Hide Show Answer button and show Next Question button
    showAnswerButton.classList.add('hidden');
    nextQuestionButton.classList.remove('hidden');
};

// Event Listeners
nextQuestionButton.addEventListener('click', () => {
    getNewQuestion();
});

startTimerButton.addEventListener('click', () => {
    startTimer();
});

showAnswerButton.addEventListener('click', () => {
    showAnswer();
});