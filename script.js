const apiKey = "X55XimZWIaSPHPnBSSsv77KrJYFYjFIz24I5m0QC";

const startBtn = document.getElementById("start-game-btn");
const submitBtn = document.getElementById("submit-guess-btn");
const guessInput = document.getElementById("guess-input");

const clueMake = document.getElementById("clue-make");
const clueYear = document.getElementById("clue-year");
const clueFuel = document.getElementById("clue-fuel");
const clueCyl = document.getElementById("clue-cylinders");
const clueTrans = document.getElementById("clue-transmission");

const resultMessage = document.getElementById("result-message");
const scoreDisplay = document.getElementById("score-display");
const roundsDisplay = document.getElementById("rounds-display");

let currentCar = null;
let attempts = 0;
const maxAttempts = 3;

function loadScore() {
  const score = localStorage.getItem("score") || 0;
  const rounds = localStorage.getItem("rounds") || 0;
  scoreDisplay.textContent = "Score: " + score;
  roundsDisplay.textContent = "Rounds Played: " + rounds;
}

async function getRandomCar() {
  try {
    const response = await fetch("/car");
    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return null;
    }
    const data = await response.json();

    if (!data || data.length === 0) return null;

    return data[Math.floor(Math.random() * data.length)];
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}


async function startGame() {
  resultMessage.textContent = "Loading car...";
  guessInput.value = "";
  attempts = 0; // Reset attempts for new game

  currentCar = await getRandomCar();

  if (!currentCar) {
    resultMessage.textContent = "Error loading car. Try again.";
    return;
  }

  clueMake.textContent = "Make: " + currentCar.make;
  clueYear.textContent = "Year: " + currentCar.year;
  clueFuel.textContent = "Fuel Type: " + currentCar.fuel_type;
  clueCyl.textContent = "Cylinders: " + currentCar.cylinders;
  clueTrans.textContent = "Transmission: " + currentCar.transmission;

  resultMessage.textContent = "Enter your guess! (3 attempts remaining)";
}

function submitGuess() {
  if (!currentCar) return;

  const guess = guessInput.value.trim().toLowerCase();
  const correct = currentCar.model.toLowerCase();

  attempts++;
  guessInput.value = ""; // Clear input after each guess

  if (guess === correct) {
    // Correct guess - award point and end round
    let score = parseInt(localStorage.getItem("score") || 0);
    let rounds = parseInt(localStorage.getItem("rounds") || 0);
    score++;
    rounds++;
    localStorage.setItem("score", score);
    localStorage.setItem("rounds", rounds);
    loadScore();
    resultMessage.textContent = "Correct! The model was " + currentCar.model + " (Guessed in " + attempts + " attempt" + (attempts > 1 ? "s" : "") + ")";
    return;
  }

  if (attempts < maxAttempts) {
    // Wrong guess but attempts remaining
    const remaining = maxAttempts - attempts;
    resultMessage.textContent = "Incorrect! Try again. (" + remaining + " attempt" + (remaining > 1 ? "s" : "") + " remaining)";
  } else {
    // Wrong guess and no attempts remaining - end round
    let rounds = parseInt(localStorage.getItem("rounds") || 0);
    rounds++;
    localStorage.setItem("rounds", rounds);
    loadScore();
    resultMessage.textContent = "Out of attempts! The correct model was " + currentCar.model;
  }
}

startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", submitGuess);

loadScore();
