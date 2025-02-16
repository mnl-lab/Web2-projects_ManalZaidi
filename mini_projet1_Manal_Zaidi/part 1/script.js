// Timer 
let timeLeft = 300; // 5 minutes (300 seconds)
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Submitting your quiz.");
            calculateScore();
        }
    }, 1000);
}

// Start the timer when the page loads
startTimer();

// Score calculation and auto-scroll
function calculateScore() {
    let score = 0;
    const questions = document.querySelectorAll('.question');

    questions.forEach((question, index) => {
        const selected = question.querySelector('select').value;
        if (selected === "correct") {
            score++;
            question.style.borderColor = "green";
        } else {
            question.style.borderColor = "red";
        }
    });

    // Update the score display
    document.getElementById('scoretxt').innerText = `Score: ${score}`;

    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Disable the submit button
    document.getElementById('submit').disabled = true;

    // Stop the timer
    clearInterval(timerInterval);
}

// Add event listener to the submit button
document.getElementById('submit').addEventListener('click', function (e) {
    e.preventDefault();
    calculateScore();
});