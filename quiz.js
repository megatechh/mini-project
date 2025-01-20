const loginForm = document.getElementById('login-form');
const loginScreen = document.getElementById('login-screen');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const userNameSpan = document.getElementById('user-name');
const categories = document.querySelectorAll('.category-button');
const startButton = document.getElementById('start-button');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const timerElement = document.getElementById('time-left');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let selectedCategory = null;
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 60;

const questions = {
    arrays: [
        { question: "What is the time complexity of accessing an element in an array?", answers: [{ text: "O(1)", correct: true }, { text: "O(n)", correct: false }, { text: "O(log n)", correct: false }, { text: "O(n^2)", correct: false }] },
        { question: "What is the default indexing in arrays?", answers: [{ text: "0-based", correct: true }, { text: "1-based", correct: false }, { text: "Random", correct: false }, { text: "Custom", correct: false }] },
        { question: "How do you access the 5th element in an array named arr?", answers: [{ text: "arr(5)", correct: false }, { text: "arr[5]", correct: false }, { text: "arr(4)", correct: false }, { text: "arr[4]", correct: true }] },
        { question: "Which of the following is true about arrays?", answers: [{ text: "Arrays are immutable.", correct: false }, { text: "Arrays cannot store duplicate values", correct: false }, { text: "Arrays have a fixed size", correct: true }, { text: "Arrays store data in linked nodes.", correct: false }] },
        { question: "Which sorting algorithm has the best average-case time complexity for sorting an array?", answers: [{ text: "Bubble sort", correct: false }, { text: "Insertion sort", correct: false }, { text: "Quick sort", correct: false }, { text: "Merge sort", correct: true }] },
    ],
    graphs: [
        { question: "Which algorithm is used to find the shortest path in a graph?", answers: [{ text: "Dijkstra's Algorithm", correct: true }, { text: "Kruskal's Algorithm", correct: false }, { text: "DFS", correct: false }, { text: "BFS", correct: false }] },
        { question: "Which data structure is used in BFS?", answers: [{ text: "Queue", correct: true }, { text: "Stack", correct: false }, { text: "Array", correct: false }, { text: "Heap", correct: false }] },
    ],
    dp: [
        { question: "What is the key characteristic of Dynamic Programming?", answers: [{ text: "Overlapping Subproblems", correct: true }, { text: "Recursive Calls", correct: false }, { text: "Greediness", correct: false }, { text: "Graph Traversal", correct: false }] },
        { question: "Which problem is solved using DP?", answers: [{ text: "Knapsack Problem", correct: true }, { text: "Prim's Algorithm", correct: false }, { text: "Quick Sort", correct: false }, { text: "Binary Search", correct: false }] },
    ],

    lg: [
        { question: "If a > b and b > c, which of the following is true?", answers: [{ text: "a < c", correct: false }, { text: "a = c", correct: false }, { text: "a > c", correct: true }, { text: "a + b < c", correct: false }] },
        { question: "Find the missing number in the series: 1, 4, 9, 16, 25, __?", answers: [{ text: "30", correct: false }, { text: "32", correct: false }, { text: "35", correct: false }, { text: "36", correct: true }] },
        { question: "If the ratio of two numbers is 3:4 and their sum is 35, what is the smaller number?", answers: [{ text: "12", correct: false }, { text: "15", correct: true }, { text: "16", correct: false }, { text: "18", correct: false }] },
        { question: "In a class of 30 students, 18 are girls and the rest are boys. What is the ratio of boys to girls?", answers: [{ text: "2:3", correct: true }, { text: "1:2", correct: false }, { text: "3:2", correct: false }, { text: "1:3", correct: false }] },
        { question: "If the average of five numbers is 20, what is their sum?", answers: [{ text: "100", correct: true }, { text: "80", correct: false }, { text: "90", correct: false }, { text: "75", correct: false }] },
    ],

    sp: [
        { question: "Which country won the 2018 FIFA World Cup?", answers: [{ text: "Brazil", correct: false }, { text: "France", correct: true }, { text: "Germany", correct: false }, { text: "Spain", correct: false }] },
        { question: "If the ratio of two numbers is 3:4 and their sum is 35, what is the smaller number?", answers: [{ text: "12", correct: false }, { text: "15", correct: true }, { text: "16", correct: false }, { text: "18", correct: false }] },
        { question: "In a class of 30 students, 18 are girls and the rest are boys. What is the ratio of boys to girls?", answers: [{ text: "2:3", correct: true }, { text: "1:2", correct: false }, { text: "3:2", correct: false }, { text: "1:3", correct: false }] },
        { question: "If the average of five numbers is 20, what is their sum?", answers: [{ text: "100", correct: true }, { text: "80", correct: false }, { text: "90", correct: false }, { text: "75", correct: false }] },
    ],

};

// Login form handling
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    userNameSpan.textContent = username;
    loginScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});


categories.forEach(category => {
    category.addEventListener('click', () => {
        categories.forEach(btn => btn.classList.remove('selected'));
        category.classList.add('selected');
        selectedCategory = category.dataset.category;
        startButton.classList.remove('hidden');
    });
});

startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', () => location.reload());

function startQuiz() {
    document.getElementById('start-screen').classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    resetState();
    const question = questions[selectedCategory][currentQuestionIndex];
    questionText.textContent = question.question;

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('answer-button');
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answerButtons.appendChild(button);
    });

    startTimer();
}

function resetState() {
    clearInterval(timer);
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    answerButtons.innerHTML = '';
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    clearInterval(timer);
    score--; // Decrement score for timeout
    moveToNextQuestion();
}

function selectAnswer(e) {
    clearInterval(timer);
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';

    Array.from(answerButtons.children).forEach(button => {
        button.classList.add(button.dataset.correct === 'true' ? 'correct' : 'incorrect');
    });

    if (correct) {
        score++;
    }

    setTimeout(() => moveToNextQuestion(), 1000);
}

function moveToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions[selectedCategory].length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
}