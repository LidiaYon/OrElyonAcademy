let examTimer;
let remainingTime = 2 * 60 * 60; // 2 hours in seconds
let isLockdownActive = false;
let windowLeaves = 0;

function startExam() {
    initializeLockdown();
    startTimer();
    enterFullScreen();
}

function initializeLockdown() {
    isLockdownActive = true;
    document.addEventListener('contextmenu', preventDefaultAction);
    document.addEventListener('copy', preventDefaultAction);
    document.addEventListener('cut', preventDefaultAction);
    document.addEventListener('paste', preventDefaultAction);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('keydown', handleKeyDown);
    updateLockdownStatus();
}

function preventDefaultAction(e) {
    e.preventDefault();
}

function handleWindowBlur() {
    if (isLockdownActive) {
        windowLeaves++;
        document.getElementById('window-leaves').textContent = `Window Leaves: ${windowLeaves}`;
        alert("Warning: Leaving the exam window is not allowed!");
    }
}

function handleKeyDown(e) {
    const forbiddenKeys = ['Tab', 'Alt', 'Meta', 'Control'];
    if (isLockdownActive && forbiddenKeys.includes(e.key)) {
        e.preventDefault();
        alert("Warning: This key combination is not allowed during the exam!");
    }
}

function enterFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

function startTimer() {
    updateTimerDisplay();
    examTimer = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        if (remainingTime <= 0) {
            clearInterval(examTimer);
            submitExam(true);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById('timer').textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateLockdownStatus() {
    document.getElementById('lockdown-status').textContent = `Lockdown Mode: ${isLockdownActive ? 'Active' : 'Inactive'}`;
}

function submitExam(isAutoSubmit = false) {
    clearInterval(examTimer);
    isLockdownActive = false;
    updateLockdownStatus();
    

    const answers = {
        q1: '2.40625',
        q2: '0.83',
        mc1: ['3/8', '6/16', '15/40', '37.5%'],
        q4: '1 1/2',
        q5: '4',
        q6: '11.4833',
        q7: '2.5',
        q8: '0.375',
        q9: '3.2857',
        q10: '1/3',
        q11: '0.25',
        q12: '-2.825',
        q13: '0.63',
        q14: ['0.667'],
        q15: '4.2',
        q16: '-1',
        q17: '-0.1',
        q18: '150',
        q19: '$42.00',
        q20: '90',
        q21: '4',
        q22: '10.63',
        q23: '450',
        q24: '4',
        q25: '$288',
        q26: '80 km/h',
        q27: '20 units',
        q28: '300 kilometers',
        q29: '150 toys',
        q30: '700000',
        q31: '2.3 million',
        q32: '1,000,000 streams',
        q33: '$10,000',
        q34: 'November',
        q35: '16 kilometers'
    };

    let score = 0;
    const form = document.getElementById('exam-form');
    const formData = new FormData(form);
    const feedback = document.getElementById('feedback');

    feedback.innerHTML = '';

    for (const [key, value] of formData.entries()) {
        const questionContainer = document.querySelector(`[name="${key}"]`).closest('.question-container');
        if (Array.isArray(answers[key])) {
            if (answers[key].includes(value)) {
                score++;
                questionContainer.classList.add('correct');
            } else {
                questionContainer.classList.add('incorrect');
                const correctAnswer = answers[key].join(', ');
                feedback.innerHTML += `<p>Question ${key} - Correct Answer: <span class="correct-answer">${correctAnswer}</span></p>`;
            }
        } else if (answers[key] && value === answers[key]) {
            score++;
            questionContainer.classList.add('correct');
        } else {
            questionContainer.classList.add('incorrect');
            const correctAnswer = answers[key];
            feedback.innerHTML += `<p>Question ${key} - Correct Answer: <span class="correct-answer">${correctAnswer}</span></p>`;
        }
    }

    const totalQuestions = Object.keys(answers).length;
    const scorePercentage = (score / totalQuestions) * 100;
    const scoreMessage = isAutoSubmit 
        ? `Time's up! Your exam has been automatically submitted. `
        : '';
    document.getElementById('score').textContent = `${scoreMessage}You scored ${score} out of ${totalQuestions} (${scorePercentage.toFixed(2)}%).`;
    document.getElementById('score-container').style.display = 'block';

    // Disable form inputs after submission
    const formInputs = form.querySelectorAll('input');
    formInputs.forEach(input => input.disabled = true);

    // Exit full screen
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    return false; // Prevent form submission
}

// Start the exam when the page loads
document.addEventListener('DOMContentLoaded', startExam);