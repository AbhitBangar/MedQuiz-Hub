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
const resultsContainer = document.getElementById('results-container');
const resultsMessage = document.getElementById('results-message');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');

let currentQuestion = {};
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let timerInterval;
let timeLeft = 10;
let timerStarted = false;

// Sound effects for timer
let audioContext;
let tickSound;
let warningSound;
let endSound;

let MAX_QUESTIONS = 20;

// Initialize sounds
function initializeSounds() {
    // Initialize Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create sound generators
    tickSound = () => playBeep(800, 50, 0.1);  // High pitch, short duration, low volume
    warningSound = () => playBeep(600, 200, 0.3);  // Medium pitch, medium duration, medium volume
    endSound = () => playBeep(400, 300, 0.4);  // Low pitch, longer duration, higher volume
}

// Play beep sound using Web Audio API
function playBeep(frequency, duration, volume) {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
        console.log('Sound error:', error);
    }
}

// Play intense countdown sound for last 5 seconds
function playIntenseCountdownSound(timeLeft) {
    try {
        // Different frequency for each second to create urgency
        const frequencies = {
            5: 1000,  // High pitch for 5
            4: 900,   // Slightly lower for 4
            3: 800,   // Lower for 3
            2: 700,   // Lower for 2
            1: 600    // Lower for 1
        };
        
        const frequency = frequencies[timeLeft] || 600;
        const duration = 150; // Shorter duration for rapid succession
        const volume = 0.5; // Higher volume for intensity
        
        playBeep(frequency, duration, volume);
    } catch (error) {
        console.log('Intense countdown sound error:', error);
    }
}

// Play sound effect
function playSound(sound) {
    try {
        if (typeof sound === 'function') {
            sound();  // Call the sound generator function
        }
    } catch (error) {
        console.log('Sound error:', error);
    }
}

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
        showResults();
        return;
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
    
    // Play immediate start sound
    playSound(tickSound);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        
        // Play tick sound every second
        if (timeLeft > 0) {
            playSound(tickSound);
        }
        
        // Change timer color when time is running out
        if (timeLeft <= 5) {
            timerDisplay.classList.add('warning');
            // Play intense countdown sound for last 5 seconds
            playIntenseCountdownSound(timeLeft);
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Timer ran out - don't show answer automatically
            // User must click "Show Answer" button to see answer
            startTimerButton.innerText = 'Show Answer';
            startTimerButton.className = 'btn-show-answer';
            startTimerButton.onclick = showAnswer;
            // Play end sound when timer reaches 0
            playSound(endSound);
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

// Show Results when quiz is complete
const showResults = () => {
    // Clear any running timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Hide the entire game container
    game.classList.add('hidden');
    
    // Show results
    resultsContainer.classList.remove('hidden');
    resultsMessage.textContent = `Great job! You've completed all ${MAX_QUESTIONS} questions!`;
};

// Restart Quiz
const restartQuiz = () => {
    // Hide results
    resultsContainer.classList.add('hidden');
    
    // Show the game container
    game.classList.remove('hidden');
    
    // Reset and start new game
    startGame();
};

// Go Home
const goHome = () => {
window.location.href = '../select.html';
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
console.log('Level 1 page loaded, initializing...');
    
// Initialize sound effects
initializeSounds();
    
// Load questions from JSON file
loadQuestionsFromJSON();
    
// Add event listeners for restart and home buttons
restartBtn.addEventListener('click', restartQuiz);
homeBtn.addEventListener('click', goHome);
});
