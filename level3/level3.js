// Function to format text with line breaks if needed
function formatTextWithLineBreaks(text, maxLength = 10) {
    let result = '';
    let words = text.split(' ');
    let currentLine = '';

    words.forEach(word => {
        // If adding the word would exceed the maxLength, break the line
        if ((currentLine + word).length > maxLength) {
            if (currentLine.length > 0) {
                result += currentLine.trim() + '\n';
                currentLine = '';
            }
        }
        currentLine += word + ' ';
    });

    result += currentLine.trim();
    return result;
}

// Get subject from URL parameter
function getSubjectFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('subject') || 'agadtantr'; // Default to agadtantr
}

// Load questions from localStorage
function loadQuestionsFromStorage() {
    const key = 'level2'; // Direct questions for level2
    const storedQuestions = localStorage.getItem(key);
    
    if (storedQuestions) {
        const questions = JSON.parse(storedQuestions);
        return questions;
    } else {
        // Return empty array if no custom questions exist
        return [];
    }
}

// Load subjects dynamically based on available questions
function loadSubjectsFromStorage() {
    const allSubjects = ["Kayachikitsa", "Kaumarbhritya", "Prasuti Tantra and Striroga", "Panchakarma", "Shalya Tantra", "Shalakya Tantra", "Samhita Adhyayan 3"];
    const availableSubjects = [];
    
    // Always show all subjects for level3 wheel
    return allSubjects;
}

// Subject mappings with their respective URLs
const subjectUrls = {
    "Kayachikitsa": "../subjects/kayachikitsa/kayachikitsa.html",
    "Kaumarbhritya": "../subjects/kaumarbhrutya/kaumarbhritya.html",
    "Prasuti Tantra and Striroga": "../subjects/prasuti/prasuti.html",
    "Panchakarma": "../subjects/panchkarm/panchakarma.html",
    "Shalya Tantra": "../subjects/shalyatantr/shalyatantr.html",
    "Shalakya Tantra": "../subjects/shalyakya/shalakya.html",
    "Samhita Adhyayan 3": "../subjects/samhita/samhita.html"
};

const subjects = loadSubjectsFromStorage();

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const selectedSegmentBtn = document.getElementById("selected-segment-btn");

const rotationValues = generateRotationValues(subjects.length);
const data = generateData(subjects.length);
const pieColors = generatePieColors(subjects.length);

// Create chart
let myChart = new Chart(wheel, {
    // Plugin for displaying text on pie chart
    plugins: [ChartDataLabels],
    // Chart Type Doughnut
    type: "doughnut",
    data: {
        // Labels (values which are to be displayed on chart)
        labels: subjects.map(subject => formatTextWithLineBreaks(subject)),
        // Settings for dataset/pie
        datasets: [
            {
                backgroundColor: pieColors,
                data: data,
                borderWidth: 1,
            },
        ],
    },
    options: {
        // Responsive chart
        responsive: true,
        animation: { duration: 0 },
        plugins: {
            // Hide tooltip and legend
            tooltip: false,
            legend: {
                display: false,
            },
            // Display labels inside pie chart
            datalabels: {
                color: "#ffffff",
                formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                font: { size: 16 }, // Adjust font size
                anchor: 'center',
                align: 'center',
                offset: 0,
                rotation: (context) => {
                    const angle = (context.dataIndex * (360 / subjects.length)) - 90;
                    return angle;
                },
                textAlign: 'center',
                textBaseline: 'middle',
            },
        },
        // Increase the size of the pie segments
        cutout: '50%', // Decrease cutout size for larger segments
    },
});

// Display value based on randomAngle
const valueGenerator = (angle) => {
    spinBtn.disabled = false;
    
    // Calculate which segment is selected based on the final angle
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const segmentAngle = 360 / subjects.length;
    const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
    const selectedSubject = subjects[selectedIndex];
    
    // Update final value display with selected subject
    finalValue.innerHTML = `<p>Selected: ${selectedSubject}</p>`;
    
    // Update button text and link with single question mode
    selectedSegmentBtn.textContent = selectedSubject;
    selectedSegmentBtn.href = `${subjectUrls[selectedSubject]}?mode=single&subject=${encodeURIComponent(selectedSubject)}`;
    selectedSegmentBtn.style.display = 'inline-flex';
    
    // Add visible class for animation
    setTimeout(() => {
        selectedSegmentBtn.classList.add('visible');
    }, 100);
};

// Initialize the button with question mark
document.addEventListener('DOMContentLoaded', function() {
    // Set initial button text to question mark
    selectedSegmentBtn.textContent = '?';
    selectedSegmentBtn.href = '#';
    selectedSegmentBtn.style.display = 'inline-flex';
    
    // Load questions and create wheel
    loadQuestionsFromStorage();
});

// Spinner count
let count = 0;
// 100 rotations for animation and last rotation for result
let resultValue = 101;

// Start spinning
spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    
    // Hide the selected segment button and reset animation
    selectedSegmentBtn.classList.remove('visible');
    selectedSegmentBtn.style.display = 'none';
    finalValue.innerHTML = '';
    
    // Generate random degrees to stop at
    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
    
    // Interval for rotation animation
    let rotationInterval = window.setInterval(() => {
        // Set rotation for pie chart
        myChart.options.rotation = (myChart.options.rotation || 0) + resultValue;
        // Update chart with new value;
        myChart.update();
        // If rotation > 360 reset it back to 0
        if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
        } else if (count > 15 && myChart.options.rotation == randomDegree) {
            valueGenerator(randomDegree);
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
        }
    }, 10);
});

// Function to generate rotation values based on the number of subjects
function generateRotationValues(subjectCount) {
    const rotationValues = [];
    const angleStep = 360 / subjectCount;

    for (let i = 0; i < subjectCount; i++) {
        const minDegree = i * angleStep;
        const maxDegree = (i + 1) * angleStep;
        rotationValues.push({ minDegree, maxDegree, index: i });
    }

    return rotationValues;
}

// Function to generate data array based on the number of subjects
function generateData(subjectCount) {
    const data = Array(subjectCount).fill(16);
    return data;
}

// Function to generate pie colors based on the number of subjects
function generatePieColors(subjectCount) {
    const colors = [];
    for (let i = 0; i < subjectCount; i++) {
        colors.push(i % 2 === 0 ? "#6200ea" : "#b163da");
    }
    return colors;
}
