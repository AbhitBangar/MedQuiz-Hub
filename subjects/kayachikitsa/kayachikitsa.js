// Kayachikitsa Questions Data
let questions = [];

// Load questions from JSON file
fetch('./kayachikitsa.json')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        initQuiz();
    })
    .catch(error => {
        console.error('Error loading questions:', error);
        // Fallback questions if JSON fails to load
        questions = [
            {
                question: "Sample question",
                options: ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
                correct: 0
            }
        ];
        initQuiz();
    });

// Quiz State
let currentQuestion = 0;
let score = 0;
let isAnswered = false;

// DOM Elements
const questionNumber = document.querySelector('.question-number');
const questionText = document.querySelector('.question-text');
const optionsContainer = document.querySelector('.options-container');
const resultMessage = document.querySelector('.result-message');
const nextBtn = document.querySelector('.next-btn');
const progressFill = document.querySelector('.progress-fill');

// Initialize Quiz
function initQuiz() {
    loadQuestion();
}

// Load Current Question
function loadQuestion() {
    const question = questions[currentQuestion];
    
    // Update question number and text
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    questionText.textContent = question.question;
    
    // Clear and populate options
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.dataset.correct = index === question.correct;
        button.addEventListener('click', () => selectAnswer(button, index));
        optionsContainer.appendChild(button);
    });
    
    // Reset state
    isAnswered = false;
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
    nextBtn.style.display = 'none';
    
    // Update progress bar
    updateProgressBar();
}

// Select Answer
function selectAnswer(button, selectedIndex) {
    if (isAnswered) return;
    
    isAnswered = true;
    const question = questions[currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    // Disable all options
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(option => {
        option.disabled = true;
        option.classList.add('disabled');
    });
    
    // Show correct/incorrect states
    button.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    if (!isCorrect) {
        // Show correct answer
        allOptions[question.correct].classList.add('correct');
    }
    
    // Update score
    if (isCorrect) {
        score++;
    }
    
    // Show result message
    showResultMessage(isCorrect);
    
    // Show next button
    nextBtn.style.display = 'inline-flex';
}

// Show Result Message
function showResultMessage(isCorrect) {
    if (isCorrect) {
        resultMessage.textContent = '✅ Correct! Well done!';
        resultMessage.classList.add('correct');
    } else {
        resultMessage.textContent = '❌ Incorrect. Try to learn from this!';
        resultMessage.classList.add('incorrect');
    }
}

// Next Question
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showFinalResult();
    }
}

// Update Progress Bar
function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

// Show Final Result
function showFinalResult() {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
        message = 'Excellent! Outstanding performance!';
        emoji = '🏆';
    } else if (percentage >= 70) {
        message = 'Great job! Good performance!';
        emoji = '🌟';
    } else if (percentage >= 50) {
        message = 'Good effort! Keep practicing!';
        emoji = '👍';
    } else {
        message = 'Keep learning! You can do better!';
        emoji = '📚';
    }
    
    // Update quiz container with final result
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.innerHTML = `
        <div class="final-result">
            <div class="result-header">
                <h2>${emoji} Kayachikitsa Quiz Complete!</h2>
            </div>
            <div class="result-stats">
                <div class="score-display">
                    <span class="score-number">${score}</span>
                    <span class="score-total">/ ${questions.length}</span>
                </div>
                <div class="percentage-display">
                    <span class="percentage-number">${percentage}%</span>
                </div>
            </div>
            <div class="result-message">
                <p>${message}</p>
            </div>
            <div class="action-buttons">
                <button class="retry-btn" onclick="location.reload()">Try Again</button>
                <button class="home-btn" onclick="window.location.href='../../select.html'">Home</button>
            </div>
        </div>
    `;
    
    // Add styles for final result
    const style = document.createElement('style');
    style.textContent = `
        .final-result {
            text-align: center;
            padding: 2rem;
        }
        
        .result-header h2 {
            font-size: 2.5rem;
            color: #6600CC;
            margin-bottom: 2rem;
        }
        
        .result-stats {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3rem;
            margin-bottom: 2rem;
        }
        
        .score-display {
            font-size: 3rem;
            font-weight: bold;
            color: #6600CC;
        }
        
        .score-total {
            font-size: 1.5rem;
            color: #6c757d;
        }
        
        .percentage-display {
            font-size: 2.5rem;
            font-weight: bold;
            color: #28a745;
        }
        
        .result-message p {
            font-size: 1.3rem;
            color: #2c3e50;
            margin-bottom: 2rem;
        }
        
        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }
        
        .retry-btn, .home-btn {
            padding: 1rem 2rem;
            font-size: 1.1rem;
            font-weight: 600;
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .retry-btn {
            background: linear-gradient(145deg, #6600CC, #5a00b3);
            color: #fff;
            box-shadow: 0 0.3rem 1rem rgba(102, 0, 204, 0.3);
        }
        
        .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.5rem 1.5rem rgba(102, 0, 204, 0.4);
        }
        
        .home-btn {
            background: linear-gradient(145deg, #28a745, #20c997);
            color: #fff;
            box-shadow: 0 0.3rem 1rem rgba(40, 167, 69, 0.3);
        }
        
        .home-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.5rem 1.5rem rgba(40, 167, 69, 0.4);
        }
    `;
    document.head.appendChild(style);
}

// Event Listeners
nextBtn.addEventListener('click', nextQuestion);

// Initialize quiz when page loads (will be called after JSON loads)
// document.addEventListener('DOMContentLoaded', initQuiz);
