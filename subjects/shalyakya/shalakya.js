// Load questions from JSON file
let questions = [];
let isSingleQuestionMode = false;
let currentSubject = '';

// Get URL parameters
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        mode: urlParams.get('mode'),
        subject: urlParams.get('subject')
    };
}

// Get session storage key for used questions
function getUsedQuestionsKey(subject) {
    return `used_questions_${subject.replace(/\s+/g, '_').toLowerCase()}`;
}

// Get unused questions for a subject
function getUnusedQuestions(allQuestions, subject) {
    const usedKey = getUsedQuestionsKey(subject);
    const usedQuestions = JSON.parse(sessionStorage.getItem(usedKey) || '[]');
    
    const unusedQuestions = allQuestions.filter((question, index) => 
        !usedQuestions.includes(index)
    );
    
    return unusedQuestions;
}

// Mark question as used
function markQuestionAsUsed(questionIndex, subject) {
    const usedKey = getUsedQuestionsKey(subject);
    const usedQuestions = JSON.parse(sessionStorage.getItem(usedKey) || '[]');
    usedQuestions.push(questionIndex);
    sessionStorage.setItem(usedKey, JSON.stringify(usedQuestions));
}

// Get random unused question
function getRandomUnusedQuestion(allQuestions, subject) {
    const unusedQuestions = getUnusedQuestions(allQuestions, subject);
    
    if (unusedQuestions.length === 0) {
        // Reset used questions if all have been used
        const usedKey = getUsedQuestionsKey(subject);
        sessionStorage.removeItem(usedKey);
        return allQuestions[Math.floor(Math.random() * allQuestions.length)];
    }
    
    const randomQuestion = unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
    const originalIndex = allQuestions.indexOf(randomQuestion);
    return { question: randomQuestion, originalIndex };
}

// Load questions from JSON file
async function loadQuestionsFromJSON() {
    try {
        const response = await fetch('./shalakya.json');
        const data = await response.json();
        questions = data.questions || [];
        return questions;
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to empty array if JSON fails to load
        return [];
    }
}

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
const prevBtn = document.querySelector('.prev-btn');
const progressFill = document.querySelector('.progress-fill');

// Initialize Quiz
async function initQuiz() {
    // Get URL parameters
    const params = getUrlParams();
    isSingleQuestionMode = params.mode === 'single';
    currentSubject = params.subject || 'Shalakya Tantra';
    
    await loadQuestionsFromJSON();
    
    if (questions.length > 0) {
        if (isSingleQuestionMode) {
            // Handle single question mode
            const randomQuestionData = getRandomUnusedQuestion(questions, currentSubject);
            currentQuestion = randomQuestionData.originalIndex;
            loadSingleQuestion();
        } else {
            // Handle normal quiz mode
            loadQuestion();
        }
    } else {
        // Handle case where no questions are loaded
        questionText.textContent = 'No questions available. Please check the JSON file.';
        optionsContainer.innerHTML = '';
    }
}

// Load Single Question (for spin wheel mode)
function loadSingleQuestion() {
    const question = questions[currentQuestion];
    
    // Update question number and text
    questionNumber.textContent = `Question 1 of 1`;
    questionText.textContent = question.question;
    
    // Clear and populate options
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.dataset.correct = index === question.correct;
        button.addEventListener('click', () => selectSingleAnswer(button, index));
        optionsContainer.appendChild(button);
    });
    
    // Reset state
    isAnswered = false;
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
    
    // Hide progress bar for single question mode
    progressFill.style.width = '100%';
    
    // Mark this question as used
    markQuestionAsUsed(currentQuestion, currentSubject);
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
    prevBtn.style.display = 'none';
    
    // Update progress bar
    updateProgressBar();
}

// Select Single Answer (for spin wheel mode)
function selectSingleAnswer(button, selectedIndex) {
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
    
    // Show result message
    showSingleResultMessage(isCorrect);
    
    // Show spin again button instead of next button
    showSpinAgainButton();
}

// Show Result Message for Single Question
function showSingleResultMessage(isCorrect) {
    if (isCorrect) {
        resultMessage.textContent = '✅ Correct! Well done!';
        resultMessage.classList.add('correct');
    } else {
        resultMessage.textContent = '❌ Incorrect. Try to learn from this!';
        resultMessage.classList.add('incorrect');
    }
}

// Show Spin Again Button
function showSpinAgainButton() {
    // Create or update the action buttons container
    let actionContainer = document.querySelector('.single-question-actions');
    if (!actionContainer) {
        actionContainer = document.createElement('div');
        actionContainer.className = 'single-question-actions';
        document.querySelector('.result-container').appendChild(actionContainer);
    }
    
    actionContainer.innerHTML = `
        <button class="spin-again-btn" onclick="window.location.href='../../level3/level3.html'">Spin Again</button>
        <button class="back-btn" onclick="window.location.href='../../select.html'">Home</button>
    `;
    
    // Add styles for single question actions
    const style = document.createElement('style');
    style.textContent = `
        .single-question-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .spin-again-btn, .back-btn {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .spin-again-btn {
            background: linear-gradient(145deg, #6600CC, #7700EE);
            color: #fff;
            box-shadow: 0 0.3rem 1rem rgba(102, 0, 204, 0.3);
        }
        
        .spin-again-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.5rem 1.5rem rgba(102, 0, 204, 0.4);
        }
        
        .back-btn {
            background: linear-gradient(145deg, #28a745, #20c997);
            color: #fff;
            box-shadow: 0 0.3rem 1rem rgba(40, 167, 69, 0.3);
        }
        
        .back-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.5rem 1.5rem rgba(40, 167, 69, 0.4);
        }
    `;
    document.head.appendChild(style);
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
    
    // Show navigation buttons
    nextBtn.style.display = 'inline-flex';
    prevBtn.style.display = currentQuestion > 0 ? 'inline-flex' : 'none';
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

// Previous Question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
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
                <h2>${emoji} Shalakya Tantra Quiz Complete!</h2>
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
                <button class="spin-btn" onclick="window.location.href='../../level3/level3.html'">Spin Again</button>
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
        
        .retry-btn, .home-btn, .spin-btn {
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
        
        .spin-btn {
            background: linear-gradient(145deg, #ff6b6b, #ff5252);
            color: #fff;
            box-shadow: 0 0.3rem 1rem rgba(255, 107, 107, 0.3);
        }
        
        .spin-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.5rem 1.5rem rgba(255, 107, 107, 0.4);
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
prevBtn.addEventListener('click', previousQuestion);

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', initQuiz);
