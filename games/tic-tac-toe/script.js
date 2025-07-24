let botMoveTimeout = null;

window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("resultModal");
  const modalTitle = document.getElementById("modalTitle");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const muteBtn = document.getElementById("muteBtn");
  const muteIcon = document.getElementById("muteIcon");
  const bgMusic = document.getElementById("bgMusic");

  const cells = document.querySelectorAll(".cell");
  const statusText = document.querySelector("#statusText");
  const restartBtn = document.querySelector("#restartBtn");
  const playWithBotCheckbox = document.querySelector("#playWithBot");

  // Background Music Setup and cleaned
  bgMusic.loop = true;
  bgMusic.volume = 0.3;

  // First interaction to enable autoplay
  document.body.addEventListener("click", () => {
    bgMusic.play().catch(() => {});
  }, { once: true });

  // Sound Effects
  const moveSound = new Audio('../../sounds/select.mp3');
  const winSound = new Audio('../../sounds/winner.mp3');
  const drawSound = new Audio('../../sounds/lost.mp3');

  moveSound.preload = 'auto';
  winSound.preload = 'auto';
  drawSound.preload = 'auto';

  moveSound.volume = 0.3;
  winSound.volume = 1;
  drawSound.volume = 1;

  let playWithBot = false;
  let currentPlayer = "X";
  let gameActive = true;
  let gameState = ["", "", "", "", "", "", "", "", ""];

  const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function handleCellClick(e) {
    const index = e.target.getAttribute("data-index");
    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    moveSound.play();

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
    moveSound.play();

    checkResult();
  }

  function showModal(message) {
    modalTitle.textContent = message;
    modal.style.display = "flex";
  }

  // Event Listeners
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    restartGame();
  });
}

  muteBtn.addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    muteIcon.classList.toggle("fa-volume-up");
    muteIcon.classList.toggle("fa-volume-mute");
  });

  cells.forEach(cell => cell.addEventListener("click", handleCellClick));
  restartBtn.addEventListener("click", restartGame);
  playWithBotCheckbox.addEventListener("change", () => {
    playWithBot = playWithBotCheckbox.checked;
    restartGame();
  });

  // Set initial status
  statusText.textContent = `${currentPlayer}'s turn`;
});
