// Edit Questions JavaScript - JSON File Based System
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
            answer: correctAnswer,
            isRapidFire: true
        };
        
        console.log('Question data to save:', questionData);
        
        // Add question to JSON file
        addQuestionToJSON('level1', questionData);
        
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
    
    // Add question function for Level 1 (JSON-based)
    function addQuestionToJSON(level, questionData) {
        try {
            console.log(`Adding question to ${level}:`, questionData);
            
            // Get current questions from JSON file
            fetch(`./${level}/questions.json`)
                .then(response => response.json())
                .then(data => {
                    const questions = data.questions || [];
                    
                    // Generate new ID
                    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
                    
                    // Add new question
                    const newQuestion = {
                        id: newId,
                        question: questionData.question,
                        answer: questionData.answer,
                        isRapidFire: questionData.isRapidFire || false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    questions.push(newQuestion);
                    
                    console.log(`Total questions in ${level} after adding:`, questions.length);
                    
                    // Update JSON file (this would require server-side implementation)
                    console.log('Note: JSON file update requires server-side implementation');
                    console.log('New question structure:', newQuestion);
                    
                    // For now, store in localStorage as fallback
                    const storageKey = `${level}_questions`;
                    localStorage.setItem(storageKey, JSON.stringify(questions));
                    console.log(`Stored in localStorage key: ${storageKey}`);
                    
                    alert('Question added successfully! (Note: JSON file update requires server-side implementation)');
                })
                .catch(error => {
                    console.error('Error loading JSON file:', error);
                    alert('Error loading questions. Please check the JSON file.');
                });
        } catch (error) {
            console.error('Error adding question to JSON:', error);
            alert('Error saving question. Please try again.');
        }
    }
    
    // Load Level 1 questions from JSON
    function loadLevel1Questions() {
        console.log('Loading Level 1 questions...');
        
        // Try to load from localStorage fallback first
        const storageKey = 'level1_questions';
        const storedQuestions = localStorage.getItem(storageKey);
        
        if (storedQuestions) {
            try {
                const data = JSON.parse(storedQuestions);
                console.log('Retrieved questions from localStorage:', data);
                console.log('Number of questions:', data.length);
                
                if (data.length === 0) {
                    level1Container.innerHTML = '<p>No questions found for Level 1.</p>';
                    return;
                }
                
                console.log('Displaying Level 1 questions...');
                displayQuestions(data, level1Container, 'level1');
                console.log('Level 1 questions loaded and displayed');
            } catch (error) {
                console.error('Error parsing stored questions:', error);
                level1Container.innerHTML = '<p>Error loading questions.</p>';
            }
        } else {
            // Try to load from JSON file
            fetch('./level1/questions.json')
                .then(response => response.json())
                .then(data => {
                    console.log('Loaded from JSON file:', data);
                    displayQuestions(data.questions, level1Container, 'level1');
                })
                .catch(error => {
                    console.error('Error loading from JSON file:', error);
                    level1Container.innerHTML = '<p>No questions found for Level 1.</p>';
                });
        }
    }
    
    // Display questions in container
    function displayQuestions(questions, container, storageKey) {
        let html = '';
        questions.forEach((question, index) => {
            if (question.isRapidFire) {
                // Rapid fire question - no options, just show the question
                html += `
                    <div class="question-item rapid-fire" data-index="${index}">
                        <div class="question-text">
                            <span class="rapid-fire-badge">🔥 Rapid Fire</span>
                            ${index + 1}. ${question.question}
                        </div>
                        <div class="answer-display">
                            <strong>Answer:</strong> ${question.answer || question.correctAnswerText || 'N/A'}
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
    
    // Initialize with empty messages
    level1Container.innerHTML = '<p>Please select Level 1 to view questions.</p>';
    level2Container.innerHTML = '<p>Please select Level 2 to view questions.</p>';
    level3Container.innerHTML = '<p>Please select Level 3 and a subject to view questions.</p>';
});

// Delete question function (localStorage fallback)
window.deleteQuestion = function(key, index) {
    if (confirm('Are you sure you want to delete this question?')) {
        const storageKey = `${key}_questions`;
        const questions = JSON.parse(localStorage.getItem(storageKey) || '[]');
        questions.splice(index, 1);
        localStorage.setItem(storageKey, JSON.stringify(questions));
        
        // Reload questions
        location.reload(); // Simple reload for now
        
        alert('Question deleted successfully!');
    }
};
