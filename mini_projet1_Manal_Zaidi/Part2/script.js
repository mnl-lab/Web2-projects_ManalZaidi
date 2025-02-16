let timeLeft = 300; // 5 minutes (300 seconds)
            let timerInterval;
            let questions = [];

            document.getElementById("cform").addEventListener("submit", function (e) {
                e.preventDefault();

                const number = document.getElementById("number").value;
                const category = document.getElementById("category").value;
                const difficulty = document.getElementById("difficulty").value;

                getQuestions(number, category, difficulty);
            });

            async function getQuestions(number, category, difficulty) {
                let url = `https://opentdb.com/api.php?amount=${number}&type=multiple`;

                if (category !== "any") url += `&category=${category}`;
                if (difficulty !== "any") url += `&difficulty=${difficulty}`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.response_code === 0 && data.results.length > 0) {
                        questions = data.results;
                        displayQuestions(questions);
                        startTimer();
                        document.getElementById("configdiv").style.display = "none";
                        document.getElementById("quizdiv").style.display = "block";
                    } else {
                        alert("No questions found for the selected criteria. Please try different settings.");
                    }
                } catch (error) {
                    console.error("Error fetching questions:", error);
                    alert("An error occurred while fetching questions. Please try again.");
                }
            }

            function displayQuestions(questions) {
                const quizContainer = document.getElementById("quiz");
                quizContainer.innerHTML = "";

                questions.forEach((question, index) => {
                    const questionDiv = document.createElement("div");
                    questionDiv.className = "question";
                    questionDiv.id = `q${index}`;
                    questionDiv.innerHTML = `
                    <h3>${index + 1}. ${question.question}</h3>
                    ${shuffleAnswers([question.correct_answer, ...question.incorrect_answers])
                            .map(answer => `
                            <label>
                                <input type="radio" name="q${index}" value="${answer === question.correct_answer ? "correct" : "incorrect"}">
                                ${answer}
                            </label><br>
                        `).join("")}
                `;
                    quizContainer.appendChild(questionDiv);
                });
            }

            function shuffleAnswers(answers) {
                return answers.sort(() => Math.random() - 0.5);
            }

            function startTimer() {
                timerInterval = setInterval(() => {
                    timeLeft--;
                    document.getElementById("timeleft").textContent = timeLeft;

                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        alert("Time's up! Submitting your quiz.");
                        calculateScore();
                    }
                }, 1000);
            }

            document.getElementById("submit").addEventListener("click", function () {
                calculateScore();
            });

            function calculateScore() {
                let score = 0;
                questions.forEach((question, index) => {
                    const selected = document.querySelector(`input[name="q${index}"]:checked`);
                    if (selected && selected.value === "correct") {
                        score++;
                        document.getElementById(`q${index}`).style.borderColor = "green";
                    }
                    else if (selected && selected.value === "incorrect") {
                        document.getElementById(`q${index}`).style.borderColor = "red";
                    }
                
                });

                document.getElementById("scoretxt").textContent = score;
                document.getElementById("submit").disabled = true;
                clearInterval(timerInterval);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        