let botMoveTimeout = null;
window.addEventListener("DOMContentLoaded", () => {
  bgMusic.play();
});


const modal = document.getElementById("resultModal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");
const bgMusic = document.getElementById("bgMusic");
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.play();


closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  restartGame();
});


// Sound Effects
const moveSound = new Audio('../../sounds/select.mp3');
const winSound = new Audio('../../sounds/winner.mp3');
const drawSound = new Audio('../../sounds/lost.mp3');
;

// Preload and set volume
moveSound.preload = 'auto';
winSound.preload = 'auto';
drawSound.preload = 'auto';

moveSound.volume =0.3;
winSound.volume = 1;
drawSound.volume = 1;

const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const playWithBotCheckbox = document.querySelector("#playWithBot");

let playWithBot = false;
let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winConditions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");

  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  moveSound.play(); // Play move sound

  checkResult();
  if (!gameActive) return;
}

function checkResult() {
  let roundWon = false;
  let winningCombo = [];

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      winningCombo = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    gameActive = false;
    statusText.textContent = `${currentPlayer} wins!`;

    winningCombo.forEach(index => {
      document.querySelector(`.cell[data-index="${index}"]`).classList.add("winning-cell");
    });

    if (playWithBot) {
      if (currentPlayer === "X") {
        winSound.play();
        showModal("🎉 You Won!");
      } else {
        drawSound.play();
        showModal("😞 You Lost!");
      }
    } else {
      winSound.play();
      showModal(`${currentPlayer} Wins! 🎉`);
    }

    return;
  }

  if (!gameState.includes("")) {
    gameActive = false;
    statusText.textContent = "It's a draw!";
    drawSound.play();
    showModal("🤝 It's a Draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
  if (playWithBot && currentPlayer === "O" && gameActive) {
    botMoveTimeout = setTimeout(makeBotMove, 500);
  }
}



function restartGame() {
  if (botMoveTimeout) {
    clearTimeout(botMoveTimeout);
    botMoveTimeout = null;
  }

  playWithBot = playWithBotCheckbox.checked;

  currentPlayer = "X";
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s turn`;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winning-cell");
  });
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
statusText.textContent = `${currentPlayer}'s turn`;

playWithBotCheckbox.addEventListener("change", () => {
  playWithBot = playWithBotCheckbox.checked;
  restartGame(); // restart when mode changes
});

function makeBotMove() {
  if (!gameActive) return;
  const emptyCells = gameState
    .map((val, index) => (val === "" ? index : null))
    .filter(index => index !== null);

  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const botCell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
  gameState[randomIndex] = currentPlayer;
  botCell.textContent = currentPlayer;
  moveSound.play(); // Bot move sound

  checkResult();
}

function showModal(message) {
  modalTitle.textContent = message;
  modal.style.display = "flex";
}

window.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", () => {
    bgMusic.play().catch(() => {});
  }, { once: true });
});

muteBtn.addEventListener("click", () => {
  if (bgMusic.muted) {
    bgMusic.muted = false;
    muteIcon.classList.remove("fa-volume-mute");
    muteIcon.classList.add("fa-volume-up");
  } else {
    bgMusic.muted = true;
    muteIcon.classList.remove("fa-volume-up");
    muteIcon.classList.add("fa-volume-mute");
  }
});

document.getElementById("muteToggle").addEventListener("change", function () {
  bgMusic.muted = this.checked;
});