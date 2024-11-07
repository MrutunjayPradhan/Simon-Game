let gameSeq = [];
let userSeq = [];
let btns = ["red", "blue", "yellow", "purple"];
let flashDuration = 250;
let gameStarted = false;
let level = 0;
let highestScore = localStorage.getItem("highScore") || 0;

const h2 = document.querySelector('h2');
const h3 = document.querySelector('h3');
const startButton = document.getElementById("startButton");
const body = document.querySelector('body');

// Display initial highest score
h3.innerText = `The highest score was: ${highestScore}`;

// Start Game when button is clicked
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        levelUp();
        startButton.style.display = "none";
    }
}

// Start Game when any key is pressed
document.addEventListener("keypress", () => {
    if (!gameStarted) startGame();
});

// Button click listeners
const allButtons = document.querySelectorAll(".btn");
allButtons.forEach(btn => btn.addEventListener("click", handleUserPress));

// Function to level up
function levelUp() {
    level++;
    flashDuration = Math.max(100, 250 - (level * 10)); // Speed up flashes as levels increase
    userSeq = [];
    h2.innerText = `Level: ${level}`;
    
    // Trigger animation by adding the class
    h2.classList.add("level-animate");
    
    // Remove the animation class after the animation completes
    setTimeout(() => h2.classList.remove("level-animate"), 500);

    // Choose a random color and add it to the game sequence
    const randomColor = btns[Math.floor(Math.random() * btns.length)];
    gameSeq.push(randomColor);
    
    displaySequence();
}

// Display game sequence with flashing buttons
async function displaySequence() {
    for (let color of gameSeq) {
        const btn = document.querySelector(`#${color}`);
        await new Promise(resolve => {
            flashButton(btn);
            setTimeout(resolve, flashDuration + 120);
        });
    }
}

// Flash effect for game button
function flashButton(btn) {
    btn.classList.add("flash");
    setTimeout(() => btn.classList.remove("flash"), flashDuration);
}

// User click response and check
function handleUserPress() {
    const userColor = this.getAttribute("id");
    userSeq.push(userColor);
    flashButton(this);

    checkUserInput(userSeq.length - 1);
}

// Check if the user's input matches the game sequence
function checkUserInput(index) {
    if (userSeq[index] === gameSeq[index]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000); // Move to next level if sequence matches
        }
    } else {
        h2.innerHTML = `Game Over! Your Score Was: ${level} <br> Press Any Key to Restart`;
        updateHighestScore();
        resetGame();
    }
}

// Update the highest score
function updateHighestScore() {
    if (level > highestScore) {
        highestScore = level;
        localStorage.setItem("highScore", highestScore);
        h3.innerText = `The highest score was: ${highestScore}`;
    }
}

// Reset the game after a loss
function resetGame() {
    gameSeq = [];
    userSeq = [];
    gameStarted = false;
    level = 0;
    startButton.style.display = "inline";

    // Display loss effect
    body.classList.add("loss");
    setTimeout(() => body.classList.remove("loss"), 500);
}


