const question = document.getElementById('question');
const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const startContainer = document.getElementById('start-container');
const showAnswerButton = document.getElementById('show-answer-button');
const answerContainer = document.getElementById('answer-container');
const answerText = document.getElementById('answer-text');
const resultsContainer = document.getElementById('results-container');
const resultsMessage = document.getElementById('results-message');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const imageContainer = document.getElementById('image-container');
const questionImage = document.getElementById('question-image');
const prevQuestionBtn = document.getElementById('prev-question-btn');

let currentQuestion = {};
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let questionHistory = []; // Track question history for back navigation

let MAX_QUESTIONS = 11;

// Case Scenarios Data
const caseScenarios = [
    {
        question: "A 30-year-old female complains of amenorrhea for 8 weeks, lower abdominal pain, and scanty dark vaginal bleeding.\nUrine pregnancy test: Positive.\nUltrasound: Empty uterus with adnexal mass.\nIdentify the disease.",
        answer: "Modern: Ectopic Pregnancy (Tubal)\nAyurveda: Garbhasanga / Garbhabhramsha (context of abnormal implantation)"
    },
    {
        question: "A 60-year-old chronic smoker presents with productive cough for 3 months over 2 consecutive years, breathlessness on exertion, and barrel-shaped chest.\nChest X-ray shows hyperinflated lungs.\nIdentify the disease.",
        answer: "Modern: Chronic Obstructive Pulmonary Disease (COPD)\nAyurveda: Tamaka Shwasa"
    },
    {
        question: "A 55-year-old male presents with severe epigastric pain radiating to the back, nausea, and vomiting.\nSerum amylase: ↑↑, Serum lipase: ↑↑.\nIdentify the disease.",
        answer: "Modern: Acute Pancreatitis\nAyurveda: Āmajanya Udarashoola / Pittaja Udarashoola (correlative diagnosis)"
    },
    {
        question: "A 50-year-old female presents with progressive abdominal distension, pedal edema, anorexia, and jaundice.\nUltrasound: Shrunken liver with ascites.\nIdentify the disease.",
        answer: "Modern: Liver Cirrhosis with Ascites\nAyurveda: Jalodara (Udara Roga)"
    },
    {
        question: "A 45-year-old male has early-morning stiffness (>1 hour), pain in small joints of hands, symmetrical swelling, and positive Rheumatoid factor.",
        answer: "Modern: Rheumatoid Arthritis\nAyurveda: Āmavāta"
    },
    {
        question: "A patient presents with severe headache, projectile vomiting, blurred vision, and papilledema on fundus exam.\nCT shows space-occupying lesion",
        answer: "Modern: Raised Intracranial Pressure (Brain Tumor)\nAyurveda: Śiroroga – Vātakaphaja"
    },
    {
        question: "A 50-year-old male presents with resting tremor, rigidity, bradykinesia, mask-like face, and shuffling gait.",
        answer: "Modern: Parkinson's disease\nAyurveda: Kampavāta"
    },
    {
        question: "A 35-year-old male complains of painful defecation, streaks of bright red blood in stool, and spasm of anal sphincter.\nOn examination: Linear tear at posterior midline.\nIdentify the disease.",
        answer: "Modern: Fissure-in-Ano\nAyurveda: Parikartika"
    },
    {
        question: "A 2-month-old presents with cough, tachypnea, wheezing, and poor feeding.\nOxygen saturation is 90% on room air.\nChest X-ray of a 2-month-old infant shows:\n• Hyperinflated lungs\n• Flattened diaphragms\n• Perihilar streaking\n• No focal consolidation\nWhat is the MOST likely diagnosis?",
        answer: "Modern: Bronchiolitis\nAyurveda: Shwasa Roga (Kaphaja Shwasa in infants)"
    },
    // {
    //     question: "A 26-week preterm neonate with RDS is on pressure-limited ventilation.\nABG shows: pH 7.25, PaCO₂ 62 mmHg, PaO₂ 70 mmHg.\nChest X-ray shows diffuse atelectasis.\nWhich ventilator adjustment will most effectively improve oxygenation?\nA. Increase respiratory rate\nB. Increase peak inspiratory pressure\nC. Increase PEEP\nD. Decrease inspiratory time\nE. Increase FiO₂ only",
    //     answer: "Modern: Increase PEEP (Positive End-Expiratory Pressure)\nAyurveda: Improves Prana Vata and enhances Agni in respiratory system"
    // },
    {
        question: "A child with prolonged fever, weight loss, hepatosplenomegaly, pancytopenia.\nBone marrow shows intracellular organisms in macrophages.\nDiagnosis?\nA. Malaria\nB. Kala-azar\nC. Brucellosis\nD. Lymphoma",
        answer: "Modern: Kala-azar (Visceral Leishmaniasis)\nAyurveda: Visarpa Jwara / Krimi Roga (systemic parasitic disease)"
    },
    {
        question: "Identify the condition shown in the image:",
        image: "../assets/level5-1.jpeg",
        answer: "Modern: Increase PEEP (Positive End-Expiratory Pressure)\nAyurveda: Improves Prana Vata and enhances Agni in respiratory system"
    }
];

// Initialize questions
function initializeQuestions() {
    questions = [...caseScenarios];
    MAX_QUESTIONS = questions.length;
    console.log('Loaded', questions.length, 'case scenarios');
    startGame();
}

const startGame = () => {
    questionCounter = 0;
    availableQuestions = [...questions];
    questionHistory = []; // Reset question history
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
    progressText.innerText = `Case ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    // Get next question in sequence (not random)
    const questionIndex = 0; // Always take the first question to maintain sequence
    currentQuestion = availableQuestions[questionIndex];
    
    // Add current question to history before moving to next
    if (questionHistory.length > 0) {
        questionHistory[questionHistory.length - 1].answered = true;
    }
    
    // Validate current question
    if (!currentQuestion || !currentQuestion.question) {
        console.error('Invalid question structure:', currentQuestion);
        // Remove invalid question and try again
        availableQuestions.splice(questionIndex, 1);
        return getNewQuestion();
    }
    
    // Add to history
    questionHistory.push({...currentQuestion, index: questionCounter - 1});
    
    // Display question
    question.innerText = currentQuestion.question;
    
    // Handle image display
    if (currentQuestion.image) {
        questionImage.src = currentQuestion.image;
        imageContainer.classList.remove('hidden');
    } else {
        imageContainer.classList.add('hidden');
    }
    
    // Remove the used question from available questions
    availableQuestions.splice(questionIndex, 1);

    // Reset UI for new question
    showStartButton();
};

const showStartButton = () => {
    startContainer.classList.remove('hidden');
    answerContainer.classList.add('hidden');
    showAnswerButton.innerText = 'Show Answer';
    showAnswerButton.className = 'btn-show-answer';
    showAnswerButton.onclick = showAnswer;
    
    // Show/hide previous button based on history
    if (questionHistory.length > 1) {
        prevQuestionBtn.classList.remove('hidden');
    } else {
        prevQuestionBtn.classList.add('hidden');
    }
};

const showAnswer = () => {
    // Get correct answer
    let correctAnswer = currentQuestion.answer || "Answer not available";
    
    answerText.innerText = correctAnswer;
    answerContainer.classList.remove('hidden');

    // Check if this is the last question
    if (questionCounter >= MAX_QUESTIONS) {
        // Last question - show Finish button
        showAnswerButton.innerText = 'Finish';
        showAnswerButton.className = 'btn-finish';
        showAnswerButton.onclick = showResults;
    } else {
        // Not last question - show Next Case button
        showAnswerButton.innerText = 'Next Case';
        showAnswerButton.className = 'btn-next-question';
        showAnswerButton.onclick = getNewQuestion;
    }
};

// Go to previous question
const goToPreviousQuestion = () => {
    if (questionHistory.length <= 1) return; // Can't go back if no history
    
    // Remove current question from history
    questionHistory.pop();
    
    // Get previous question from history
    const previousQuestion = questionHistory[questionHistory.length - 1];
    
    // Restore question state
    currentQuestion = previousQuestion;
    questionCounter = previousQuestion.index + 1;
    
    // Update progress
    progressText.innerText = `Case ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    
    // Display question
    question.innerText = currentQuestion.question;
    
    // Handle image display
    if (currentQuestion.image) {
        questionImage.src = currentQuestion.image;
        imageContainer.classList.remove('hidden');
    } else {
        imageContainer.classList.add('hidden');
    }
    
    // Add the question back to available questions
    availableQuestions.unshift(currentQuestion);
    
    // Reset UI
    showStartButton();
};

// Show Results when quiz is complete
const showResults = () => {
    // Hide the entire game container
    game.classList.add('hidden');
    
    // Show results
    resultsContainer.classList.remove('hidden');
    resultsMessage.textContent = `Great job! You've completed all ${MAX_QUESTIONS} case scenarios!`;
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
    console.log('Level 5 page loaded, initializing...');
    
    // Initialize questions
    initializeQuestions();
    
    // Add event listeners for restart and home buttons
    restartBtn.addEventListener('click', restartQuiz);
    homeBtn.addEventListener('click', goHome);
    prevQuestionBtn.addEventListener('click', goToPreviousQuestion);
});
