// Interactive Image Gallery - Level 4

// Image Data
const imageData = [
    {
        image: '../assets/level4/1.jpeg',
        title: "Medical Image 1",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/2.jpeg',
        title: "Medical Image 2",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/3.jpeg',
        title: "Medical Image 3",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/4.jpeg',
        title: "Medical Image 4",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/5.jpeg',
        title: "Medical Image 5",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/6.jpeg',
        title: "Medical Image 6",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/7.jpeg',
        title: "Medical Image 7",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/8.jpeg',
        title: "Medical Image 8",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/9.jpeg',
        title: "Medical Image 9",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/10.jpeg',
        title: "Medical Image 10",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/11.jpeg',
        title: "Medical Image 11",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/12.jpeg',
        title: "Medical Image 12",
        explanation: "This is a medical image for educational purposes."
    },
    {
        image: '../assets/level4/13.jpeg',
        title: "Medical Image 13",
        explanation: "This is a medical image for educational purposes."
    }
];

// Gallery State
let currentImage = 0;

// DOM Elements
const quizImage = document.getElementById('quizImage');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const progressText = document.getElementById('progressText');
const resultContainer = document.getElementById('resultContainer');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const closeBtn = document.querySelector(".close-btn");

// Initialize Gallery
function initGallery() {
    currentImage = 0;
    resultContainer.style.display = 'none';
    loadImage();
}

// Load Current Image
function loadImage() {
    const image = imageData[currentImage];
    
    // Update image
    quizImage.src = image.image;
    
    // Hide question and options
    questionText.style.display = 'none';
    optionsContainer.style.display = 'none';
    
    // Update progress
    progressText.textContent = `${currentImage + 1} / ${imageData.length}`;
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Update Navigation Buttons
function updateNavigationButtons() {
    backBtn.disabled = currentImage === 0;
    
    if (currentImage === imageData.length - 1) {
        nextBtn.textContent = 'Finish';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

// Navigation Functions
function goBack() {
    if (currentImage > 0) {
        currentImage--;
        loadImage();
    }
}

function goNext() {
    if (currentImage < imageData.length - 1) {
        currentImage++;
        loadImage();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    // Hide gallery content
    document.querySelector('.image-container').style.display = 'none';
    document.querySelector('.question-container').style.display = 'none';
    document.querySelector('.navigation-container').style.display = 'none';
    
    // Show results
    resultContainer.style.display = 'block';
    finalScore.textContent = `Gallery Complete! You viewed all ${imageData.length} images.`;
}

// Restart Gallery
function restartGallery() {
    // Show gallery content
    document.querySelector('.image-container').style.display = 'block';
    document.querySelector('.question-container').style.display = 'block';
    document.querySelector('.navigation-container').style.display = 'flex';
    
    // Reset gallery
    initGallery();
}

// Go Home
function goHome() {
    window.location.href = '../select.html';
}

// Show Explanation Popup
function showExplanation() {
    const image = imageData[currentImage];
    popupText.textContent = image.explanation;
    popup.style.display = "block";
}

// Close Popup
function closePopup() {
    popup.style.display = "none";
}

// Event Listeners
backBtn.addEventListener('click', goBack);
nextBtn.addEventListener('click', goNext);
restartBtn.addEventListener('click', restartGallery);
homeBtn.addEventListener('click', goHome);
closeBtn.addEventListener('click', closePopup);

// Image click event for popup
quizImage.addEventListener('click', showExplanation);

// Close popup when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === popup) {
        closePopup();
    }
});

// Keyboard events
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (popup.style.display === "block") {
            closePopup();
        }
    }
});

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', initGallery);