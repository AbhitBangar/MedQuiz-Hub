// Interactive Image Gallery - Level 4

// Image Data
const imageData = [
    {
        image: '../assets/level4/1.jpeg',
        title: "Medical Image 1",
        explanation: "Medinaz - Kwashiorkor."
    },
    {
        image: '../assets/level4/2.jpeg',
        title: "Medical Image 2",
        explanation: "X-linked Agammaglobulinemia (XLA). The image illustrates key features of X-linked Agammaglobulinemia, a primary immunodeficiency disorder."
    },
    {
        image: '../assets/level4/3.jpeg',
        title: "Medical Image 3",
        explanation: "Lumbar puncture, also known as a spinal tap."
    },
    {
        image: '../assets/level4/4.jpeg',
        title: "Medical Image 4",
        explanation: "The image illustrates a medical mnemonic for Sturge-Weber Syndrome, a rare neurocutaneous disorder characterized by abnormal development of blood vessels in the brain, eyes, and skin."
    },
    {
        image: '../assets/level4/5.jpeg',
        title: "Medical Image 5",
        explanation: "Edwards Syndrome (Trisomy 18). Kidney, Heart, CNS malformations. Many die in utero. Half of those born don't survive past 1st week."
    },
    {
        image: '../assets/level4/6.jpeg',
        title: "Medical Image 6",
        explanation: "Phenylketonuria (PKU) Phenylketonuria is an inherited disorder that increases the levels of a substance called phenylalanine in the blood. It is caused by a defect in the gene that helps create the enzyme needed to break down phenylalanine."
    },
    {
        image: '../assets/level4/7.jpeg',
        title: "Medical Image 7",
        explanation: "Congenital Syphilis. The image illustrates various clinical manifestations of late congenital syphilis."
    },
    {
        image: '../assets/level4/8.jpeg',
        title: "Medical Image 8",
        explanation: "Typhoid Fever. The image illustrates the clinical manifestations of typhoid fever, a serious bacterial infection caused by Salmonella typhi that is spread through contaminated food or water."
    },
    {
        image: '../assets/level4/9.jpeg',
        title: "Medical Image 9",
        explanation: "Reye's Syndrome.This illustration depicts Reye's syndrome, a rare but serious condition that causes swelling in the liver and brain. It typically affects children and teenagers recovering from a viral infection, such as chickenpox."
    },
    {
        image: '../assets/level4/10.jpeg',
        title: "Medical Image 10",
        explanation: "The disease is Graves' disease. This is an autoimmune disorder that causes the thyroid gland to produce too much hormone (hyperthyroidism)."
    },
    {
        image: '../assets/level4/11.jpeg',
        title: "Medical Image 11",
        explanation: "Pyloric stenosis."
    },
    {
        image: '../assets/level4/12.jpeg',
        title: "Medical Image 12",
        explanation: "Kawasaki Disease"
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