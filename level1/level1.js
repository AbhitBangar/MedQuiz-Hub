const question = document.getElementById('question');
const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const timerDisplay = document.getElementById('timer');
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

// Get subject from URL parameter
function getSubjectFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('subject') || 'agadtantr'; // Default to agadtantr
}

// Load questions from JSON file
function loadQuestionsFromJSON() {
    try {
        fetch('./questions.json')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (!data || !data.questions) {
                    throw new Error("Invalid JSON structure");
                }

                questions = data.questions;
                MAX_QUESTIONS = questions.length;
                console.log('Loaded', questions.length, 'questions from JSON file');
                startGame();
            })
            .catch((err) => {
                console.error("There was an error fetching questions from JSON file:", err);
                // Show error message to user
                loader.innerHTML = '<div style="text-align: center; color: #dc3545; font-size: 1.2rem;">Error loading questions. Please check the questions.json file.</div>';
            });
    } catch (error) {
        console.error("Error in loadQuestionsFromJSON:", error);
        loader.innerHTML = '<div style="text-align: center; color: #dc3545; font-size: 1.2rem;">Error loading questions. Please check the questions.json file.</div>';
    }
}

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
    
    // Validate current question
    if (!currentQuestion || !currentQuestion.question) {
        console.error('Invalid question structure:', currentQuestion);
        // Remove invalid question and try again
        availableQuestions.splice(questionIndex, 1);
        return getNewQuestion();
    }
    
    // Format question for display
    let questionText = currentQuestion.question;
    
    try {
        if (currentQuestion.isRapidFire) {
            // Rapid fire question - show question and answer separately
            question.innerText = questionText;
            // Use the stored answer from JSON structure
            currentQuestion.correctAnswerText = currentQuestion.answer || currentQuestion.correctAnswerText || questionText.split('–')[1]?.trim() || questionText.split('-')[1]?.trim() || questionText;
        } else if (currentQuestion.options) {
            // Custom questions with options
            questionText += '\n\n';
            questionText += `A. ${currentQuestion.options.A}\n`;
            questionText += `B. ${currentQuestion.options.B}\n`;
            questionText += `C. ${currentQuestion.options.C}\n`;
            questionText += `D. ${currentQuestion.options.D}`;
            
            // Store correct answer for display
            currentQuestion.correctAnswerText = currentQuestion.options[currentQuestion.correctAnswer];
            question.innerText = questionText;
        } else {
            // Default questions format
            question.innerText = questionText;
        }
    } catch (error) {
        console.error('Error formatting question:', error);
        question.innerText = questionText;
    }

    availableQuestions.splice(questionIndex, 1);

    // Reset timer and UI for new question
    resetTimer();
    showStartButton();
};

const showStartButton = () => {
    startContainer.classList.remove('hidden');
    answerContainer.classList.add('hidden');
    startTimerButton.innerText = 'Start Timer';
    startTimerButton.className = 'btn-start-timer';
    startTimerButton.onclick = startTimer;
    timerStarted = false;
};

const startTimer = () => {
    timeLeft = 20;
    timerDisplay.innerText = timeLeft;
    
    // Change button to Show Answer
    startTimerButton.innerText = 'Show Answer';
    startTimerButton.className = 'btn-show-answer';
    startTimerButton.onclick = showAnswer;
    answerContainer.classList.add('hidden');
    timerStarted = true;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        // Change timer color when time is running out
        if (timeLeft <= 5) {
            timerDisplay.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // When timer runs out, automatically show answer
            showAnswer();
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
    timerDisplay.innerText = '20';
    timerStarted = false;
};

const showAnswer = () => {
    clearInterval(timerInterval);

    // Get correct answer
    let correctAnswer;
    if (currentQuestion.correctAnswerText) {
        // Rapid fire questions or custom questions from localStorage
        correctAnswer = currentQuestion.correctAnswerText;
    } else if (currentQuestion.options) {
        // Custom questions with options
        correctAnswer = currentQuestion.options[currentQuestion.correctAnswer];
    } else {
        // Fallback - no answer available
        correctAnswer = "Answer not available";
    }
    
    answerText.innerText = correctAnswer;
    answerContainer.classList.remove('hidden');

    // Change button to Next Question
    startTimerButton.innerText = 'Next Question';
    startTimerButton.className = 'btn-next-question';
    startTimerButton.onclick = getNewQuestion;
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    console.log('Level 1 page loaded, initializing...');
    
    // Load questions from JSON file
    loadQuestionsFromJSON();
});
