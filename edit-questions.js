// Edit Questions JavaScript - Multi-Level Support
document.addEventListener('DOMContentLoaded', function() {
    const levelSelect = document.getElementById('level-select');
    const level1Section = document.getElementById('level1-section');
    const level2Section = document.getElementById('level2-section');
    const level3Section = document.getElementById('level3-section');
    const level3SubjectSelect = document.getElementById('level3-subject-select');
    
    // Form elements for each level
    const level1Form = document.getElementById('add-level1-question-form');
    const level2Form = document.getElementById('add-level2-question-form');
    const level3Form = document.getElementById('add-level3-question-form');
    
    // Containers for questions
    const level1Container = document.getElementById('level1-questions-container');
    const level2Container = document.getElementById('level2-questions-container');
    const level3Container = document.getElementById('level3-questions-container');
    
    // Level selection handler
    levelSelect.addEventListener('change', function() {
        const selectedLevel = this.value;
        
        // Hide all sections
        level1Section.classList.add('hidden');
        level2Section.classList.add('hidden');
        level3Section.classList.add('hidden');
        
        // Show selected section
        switch(selectedLevel) {
            case 'level1':
                level1Section.classList.remove('hidden');
                loadLevel1Questions();
                break;
            case 'level2':
                level2Section.classList.remove('hidden');
                loadLevel2Questions();
                break;
            case 'level3':
                level3Section.classList.remove('hidden');
                loadLevel3Questions();
                break;
        }
    });
    
    // Level 1 form submission
    level1Form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Level 1 form submitted');
        
        const questionText = document.getElementById('level1-question-text').value.trim();
        const correctAnswer = document.getElementById('level1-correct-answer').value.trim();
        
        console.log('Question text:', questionText);
        console.log('Correct answer:', correctAnswer);
        
        if (!questionText) {
            alert('Please fill in the question field!');
            return;
        }
        
        if (!correctAnswer) {
            alert('Please fill in the correct answer field!');
            return;
        }
        
        const questionData = {
            question: questionText,
            correctAnswerText: correctAnswer,
            isRapidFire: true
        };
        
        console.log('Question data to save:', questionData);
        
        // Add question to localStorage
        addQuestionToStorage('level1', questionData);
        
        // Clear form
        level1Form.reset();
        
        // Reload questions
        loadLevel1Questions();
        
        alert('Question added successfully!');
        console.log('Level 1 question added and reloaded');
    });
    
    // Level 2 form submission
    level2Form.addEventListener('submit', function(e) {
        e.preventDefault();
        addQuestion('level2');
    });
    
    // Level 3 subject selection
    level3SubjectSelect.addEventListener('change', function() {
        loadLevel3Questions();
    });
    
    // Level 3 form submission
    level3Form.addEventListener('submit', function(e) {
        e.preventDefault();
        const selectedSubject = level3SubjectSelect.value;
        if (!selectedSubject) {
            alert('Please select a subject first!');
            return;
        }
        addQuestion('level3');
    });
    
    // Add question function
    function addQuestion(level) {
        let questionData;
        
        switch(level) {
            case 'level1':
                const questionText = document.getElementById('level1-question-text').value.trim();
                const correctAnswer = document.getElementById('level1-correct-answer').value.trim();
                
                questionData = {
                    question: questionText,
                    correctAnswerText: correctAnswer,
                    isRapidFire: true
                };
                break;
                
            case 'level2':
                questionData = {
                    question: document.getElementById('level2-question-text').value.trim(),
                    options: {
                        A: document.getElementById('level2-option-a').value.trim(),
                        B: document.getElementById('level2-option-b').value.trim(),
                        C: document.getElementById('level2-option-c').value.trim(),
                        D: document.getElementById('level2-option-d').value.trim()
                    },
                    correctAnswer: document.getElementById('level2-correct-answer').value
                };
                break;
                
            case 'level3':
                const selectedSubject = level3SubjectSelect.value;
                if (!selectedSubject) {
                    alert('Please select a subject first!');
                    return;
                }
                questionData = {
                    question: document.getElementById('level3-question-text').value.trim(),
                    options: {
                        A: document.getElementById('level3-option-a').value.trim(),
                        B: document.getElementById('level3-option-b').value.trim(),
                        C: document.getElementById('level3-option-c').value.trim(),
                        D: document.getElementById('level3-option-d').value.trim()
                    },
                    correctAnswer: document.getElementById('level3-correct-answer').value
                };
                break;
        }
        
        // Validate data
        if (!questionData.question) {
            alert('Please fill in the question field!');
            return;
        }
        
        // For Level 1, check if correct answer is provided
        if (level === 'level1' && !questionData.correctAnswerText) {
            alert('Please fill in the correct answer field!');
            return;
        }
        
        // Add question to localStorage
        if (level === 'level3') {
            const selectedSubject = level3SubjectSelect.value;
            addQuestionToStorage(`${level}_${selectedSubject}`, questionData);
        } else {
            addQuestionToStorage(level, questionData);
        }
        
        // Clear form
        if (level === 'level1') {
            level1Form.reset();
        } else if (level === 'level2') {
            level2Form.reset();
        } else if (level === 'level3') {
            level3Form.reset();
        }
        
        // Reload questions
        if (level === 'level1') {
            loadLevel1Questions();
        } else if (level === 'level2') {
            loadLevel2Questions();
        } else if (level === 'level3') {
            loadLevel3Questions();
        }
        
        alert('Question added successfully!');
    }
    
    // Load Level 1 questions
    function loadLevel1Questions() {
        console.log('Loading Level 1 questions...');
        
        const questions = getQuestionsFromStorage('level1');
        
        console.log('Retrieved questions from localStorage:', questions);
        console.log('Number of questions:', questions.length);
        
        if (questions.length === 0) {
            level1Container.innerHTML = '<p>No questions found for Level 1.</p>';
            return;
        }
        
        console.log('Displaying Level 1 questions...');
        displayQuestions(questions, level1Container, 'level1');
        console.log('Level 1 questions loaded and displayed');
    }
    
    // Load Level 2 questions
    function loadLevel2Questions() {
        const questions = getQuestionsFromStorage('level2');
        
        if (questions.length === 0) {
            level2Container.innerHTML = '<p>No questions found for Level 2.</p>';
            return;
        }
        
        displayQuestions(questions, level2Container, 'level2');
    }
    
    // Load Level 3 questions
    function loadLevel3Questions() {
        const selectedSubject = level3SubjectSelect.value;
        
        if (!selectedSubject) {
            level3Container.innerHTML = '<p>Please select a subject to view questions.</p>';
            return;
        }
        
        const questions = getQuestionsFromStorage(`level3_${selectedSubject}`);
        
        if (questions.length === 0) {
            level3Container.innerHTML = '<p>No questions found for this subject.</p>';
            return;
        }
        
        displayQuestions(questions, level3Container, `level3_${selectedSubject}`);
    }
    
    // Display questions in container
    function displayQuestions(questions, container, storageKey) {
        let html = '';
        questions.forEach((question, index) => {
            if (question.isRapidFire) {
                // Rapid fire question - no options
                html += `
                    <div class="question-item rapid-fire" data-index="${index}">
                        <div class="question-text">
                            <span class="rapid-fire-badge">🔥 Rapid Fire</span>
                            ${index + 1}. ${question.question}
                        </div>
                        <div class="question-actions">
                            <button class="btn-danger" onclick="deleteQuestion('${storageKey}', ${index})">
                                Delete
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // Regular question with options
                html += `
                    <div class="question-item" data-index="${index}">
                        <div class="question-text">${index + 1}. ${question.question}</div>
                        <div class="question-options">
                            <div class="option ${question.correctAnswer === 'A' ? 'correct' : ''}">
                                A. ${question.options.A}
                            </div>
                            <div class="option ${question.correctAnswer === 'B' ? 'correct' : ''}">
                                B. ${question.options.B}
                            </div>
                            <div class="option ${question.correctAnswer === 'C' ? 'correct' : ''}">
                                C. ${question.options.C}
                            </div>
                            <div class="option ${question.correctAnswer === 'D' ? 'correct' : ''}">
                                D. ${question.options.D}
                            </div>
                        </div>
                        <div class="question-actions">
                            <button class="btn-danger" onclick="deleteQuestion('${storageKey}', ${index})">
                                Delete
                            </button>
                        </div>
                    </div>
                `;
            }
        });
        
        container.innerHTML = html;
    }
    
    // Get questions from localStorage
    function getQuestionsFromStorage(key) {
        const questions = localStorage.getItem(key);
        return questions ? JSON.parse(questions) : [];
    }
    
    // Add question to localStorage
    function addQuestionToStorage(key, questionData) {
        try {
            console.log(`Adding question to ${key}:`, questionData);
            
            const questions = getQuestionsFromStorage(key);
            questions.push(questionData);
            
            console.log(`Total questions in ${key} after adding:`, questions.length);
            
            localStorage.setItem(key, JSON.stringify(questions));
            
            console.log(`Successfully saved to localStorage key: ${key}`);
            
            // Verify it was saved
            const savedQuestions = localStorage.getItem(key);
            console.log(`Verification - saved data length:`, savedQuestions ? savedQuestions.length : 'null');
            
            if (savedQuestions) {
                const parsed = JSON.parse(savedQuestions);
                console.log('Last question in storage:', parsed[parsed.length - 1]);
            }
        } catch (error) {
            console.error('Error adding question to storage:', error);
            alert('Error saving question. Please try again.');
        }
    }
    
    // Delete question from localStorage
    window.deleteQuestion = function(key, index) {
        if (confirm('Are you sure you want to delete this question?')) {
            const questions = getQuestionsFromStorage(key);
            questions.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(questions));
            
            // Reload appropriate questions
            if (key === 'level1') {
                loadLevel1Questions();
            } else if (key === 'level2') {
                loadLevel2Questions();
            } else if (key.startsWith('level3_')) {
                loadLevel3Questions();
            }
            
            alert('Question deleted successfully!');
        }
    };
    
    // Initialize with empty messages
    level1Container.innerHTML = '<p>Please select Level 1 to view questions.</p>';
    level2Container.innerHTML = '<p>Please select Level 2 to view questions.</p>';
    level3Container.innerHTML = '<p>Please select Level 3 and a subject to view questions.</p>';
    
    // Auto-add rapid fire questions to Level 1 if not already present
    autoAddRapidFireQuestions();
});

// Auto-add rapid fire questions to Level 1
function autoAddRapidFireQuestions() {
    // Clear existing questions first to ensure clean state
    localStorage.removeItem('level1');
    
    const rapidFireQuestions = [
        { question: "Upadhātu of Rasa – Raja", correctAnswer: "Raja" },
        { question: "Asthi dhātu mala – Kesha", correctAnswer: "Kesha" },
        { question: "Number of Srotas (Charaka) – Thirteen", correctAnswer: "Thirteen" },
        { question: "Main Doṣa in Prameha – Kapha", correctAnswer: "Kapha" },
        { question: "Drug of choice in Vātavyādhi – Basti", correctAnswer: "Basti" },
        { question: "Vitamin deficiency causing night blindness – Vitamin-A", correctAnswer: "Vitamin-A" },
        { question: "Emergency antidote in OP poisoning – Atropine", correctAnswer: "Atropine" },
        { question: "Surgical procedure for Bhagandara – Ksharasutra", correctAnswer: "Ksharasutra" },
        { question: "Pregnancy in fallopian tube is called - ectopic pregnancy", correctAnswer: "ectopic pregnancy" },
        { question: "Sannipatika gulma is also known as - Nichaya gulma", correctAnswer: "Nichaya gulma" },
        { question: "Nerve tested in corneal reflex – Trigeminal", correctAnswer: "Trigeminal" },
        { question: "First Rasāyana described in Charaka – Āmalaki", correctAnswer: "Āmalaki" },
        { question: "Harmone responsible for screation of milk - prolactin", correctAnswer: "prolactin" },
        { question: "Harmone responsible for ejection of milk - oxytocin", correctAnswer: "oxytocin" },
        { question: "Number of Marmas (Suśruta) – One-hundred-seven", correctAnswer: "One-hundred-seven" },
        { question: "Test to detect tuberculosis – Mantoux", correctAnswer: "Mantoux" },
        { question: "Drug used in acute asthma attack – Salbutamol", correctAnswer: "Salbutamol" },
        { question: "Commonest valve involved in RHD – Mitral", correctAnswer: "Mitral" },
        { question: "Ayurvedic term for Ascites – Jalodara", correctAnswer: "Jalodara" },
        { question: "Line of fracture separation in children – Epiphysis", correctAnswer: "Epiphysis" }
    ];
    
    // Add all rapid fire questions to Level 1
    rapidFireQuestions.forEach(questionData => {
        const formattedQuestion = {
            question: questionData.question,
            correctAnswerText: questionData.correctAnswer,
            isRapidFire: true
        };
        addQuestionToStorage('level1', formattedQuestion);
    });
    
    console.log('Added 20 rapid fire questions to Level 1');
    
    // Reload Level 1 questions if it's currently selected
    if (levelSelect.value === 'level1') {
        loadLevel1Questions();
    }
}
