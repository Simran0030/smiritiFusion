// Game Configuration
const config = {
  phase1: {
    name: "Logo Match",
    items: [
      { id: "html", html: "<img src='Images/html.png' onerror=\"this.src='placeholder.png'\" alt='HTML5'>" },
      { id: "css", html: "<img src='Images/css.png' onerror=\"this.src='placeholder.png'\" alt='CSS3'>" },
      { id: "js", html: "<img src='Images/javascript.png' onerror=\"this.src='placeholder.png'\" alt='JavaScript'>" },
      { id: "python", html: "<img src='Images/python.jpg' onerror=\"this.src='placeholder.png'\" alt='Python'>" },
      { id: "java", html: "<img src='Images/java.jpg' onerror=\"this.src='placeholder.png'\" alt='Java'>" },
      { id: "csharp", html: "<img src='Images/cc.png' onerror=\"this.src='placeholder.png'\" alt='C#'>" },
      { id: "cpp", html: "<img src='Images/c++.png' onerror=\"this.src='placeholder.png'\" alt='C++'>" },
      { id: "php", html: "<img src='Images/php.png' onerror=\"this.src='placeholder.png'\" alt='PHP'>" },
      { id: "matlab", html: "<img src='Images/mat.jpg' onerror=\"this.src='placeholder.png'\" alt='MATLAB'>" },
      { id: "mysql", html: "<img src='Images/mysql.png' onerror=\"this.src='placeholder.png'\" alt='MySQL'>" },
      { id: "typescript", html: "<img src='Images/ts.png' onerror=\"this.src='placeholder.png'\" alt='TypeScript'>" },
      { id: "swift", html: "<img src='Images/swift.png' onerror=\"this.src='placeholder.png'\" alt='Swift'>" },
      { id: "ruby", html: "<img src='Images/Ruby.jpeg' onerror=\"this.src='placeholder.png'\" alt='Ruby'>" },
      { id: "rust", html: "<img src='Images/rust.jpeg' onerror=\"this.src='placeholder.png'\" alt='Rust'>" },
      { id: "kotlin", html: "<img src='Images/kotlin.jpg' onerror=\"this.src='placeholder.png'\" alt='Kotlin'>" },
      { id: "node", html: "<img src='Images/node.jpeg' onerror=\"this.src='placeholder.png'\" alt='Node.js'>" }
    ]
  },
  phase2: {
    name: "Binary Match",
    items: [
      { id: "num1", decimal: "1", binary: "0001" },
      { id: "num2", decimal: "2", binary: "0010" },
      { id: "num3", decimal: "3", binary: "0011" },
      { id: "num4", decimal: "4", binary: "0100" },
      { id: "num5", decimal: "5", binary: "0101" },
      { id: "num6", decimal: "6", binary: "0110" },
      { id: "num7", decimal: "7", binary: "0111" },
      { id: "num8", decimal: "8", binary: "1000" },
      { id: "num9", decimal: "9", binary: "1001" },
      { id: "num10", decimal: "10", binary: "1010" },
      { id: "num12", decimal: "12", binary: "1100" },
      { id: "num15", decimal: "15", binary: "1111" },
      { id: "num16", decimal: "16", binary: "00010000" },
      { id: "num20", decimal: "20", binary: "00010100" },
      { id: "num24", decimal: "24", binary: "00011000" },
      { id: "num32", decimal: "32", binary: "00100000" }
    ]
  }
};

// Game State
const state = {
  currentPhase: 1,
  gameMode: 'both',
  score: 0,
  moves: 0,
  matchedPairs: 0,
  totalPairs: 0,
  firstCard: null,
  secondCard: null,
  lockBoard: false,
  timerInterval: null,
  time: 0,
  gameStarted: false,
  currentDifficulty: null
};

// DOM Elements
const dom = {
  phaseIndicator: document.querySelector('#phase-indicator span'),
  scoreDisplay: document.querySelector('#score-display span'),
  movesDisplay: document.querySelector('#moves'),
  timeDisplay: document.querySelector('#time'),
  messageBox: document.getElementById('message-box'),
  leaderboardModal: document.getElementById('leaderboard-modal'),
  leaderboardResults: document.getElementById('leaderboard-results'),
  phaseTransition: document.getElementById('phase-transition'),
  phaseResults: document.getElementById('phase-results')
};

// Initialize game
window.onload = function() {
  initScreenSize();
  showInstructions();
  setupEventListeners();
  setInterval(createFloatingNumber, 500);
};

function createFloatingNumber() {
  const container = document.getElementById("floating-numbers");
  const number = document.createElement("div");
  number.classList.add("floating-number");
  number.textContent = Math.floor(Math.random() * 100);
  number.style.left = Math.random() * 100 + "vw";
  number.style.animationDuration = (5 + Math.random() * 5) + "s";
  number.style.fontSize = (16 + Math.random() * 16) + "px";
  container.appendChild(number);

  setTimeout(() => {
    number.remove();
  }, 15000);
}

// Set up event listeners
function setupEventListeners() {
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('musicBtn');
  
  musicBtn.addEventListener('click', function() {
    if (bgMusic.paused) {
      bgMusic.play();
      musicBtn.textContent = '🔈 Mute';
    } else {
      bgMusic.pause();
      musicBtn.textContent = '🔇 Unmute';
    }
  });
  
  document.addEventListener('click', function() {
    if (bgMusic.paused) {
      bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, { once: true });

  document.getElementById('quitBtn').addEventListener('click', quitGame);
}

// Initialize screen size
function initScreenSize() {
  const setHeight = () => {
    document.body.style.height = `${window.innerHeight}px`;
    document.getElementById('ol').style.height = `${window.innerHeight}px`;
  };
  
  setHeight();
  window.addEventListener('resize', setHeight);
}

// Show instructions
function showInstructions() {
  $("#ol").html(`
    <div id="inst">
      <h2>MEMORY MASTER</h2>
      <p>Test your memory with these challenging games!</p>
      
      <div class="game-mode-selector">
        <div class="mode-option" onclick="selectMode('logo')">
          <h3>Logo Match</h3>
          <p>Match pairs of programming language logos</p>
        </div>
        <div class="mode-option" onclick="selectMode('binary')">
          <h3>Binary Match</h3>
          <p>Match numbers with their binary equivalents</p>
        </div>
        <div class="mode-option" onclick="selectMode('both')">
          <h3>Dual Challenge</h3>
          <p>Complete both phases back-to-back</p>
        </div>
      </div>

      <div id="difficulty-buttons" style="display: none; margin-top: 30px;">
        <p>Select difficulty:</p>
        <div class="grid-buttons">
          <button onclick="startGame(2, 4, state.gameMode)">Easy (2×4)</button>
          <button onclick="startGame(3, 4, state.gameMode)">Normal (3×4)</button>
          <button onclick="startGame(4, 4, state.gameMode)">Medium (4×4)</button>
          <button onclick="startGame(4, 7, state.gameMode)">Hard (4×7)</button>
        </div>
      </div>
      
      <button onclick="showLeaderboard()" style="margin-top: 20px;">View Leaderboard</button>
    </div>
  `);
}

function selectMode(mode) {
  state.gameMode = mode;
  $("#inst .mode-option").removeClass("selected");
  $(`#inst .mode-option:nth-child(${
    mode === 'logo' ? 1 : mode === 'binary' ? 2 : 3
  })`).addClass("selected");
  $("#difficulty-buttons").fadeIn();
}

// Start the game
function startGame(rows, cols, mode) {
  resetGame();
  state.gameMode = mode;
  state.gameStarted = true;
  state.totalPairs = (rows * cols) / 2;
  
  // Set timer based on difficulty
  const baseTime = mode === 'both' ? 120 : 90;
  const timeMultiplier = (rows * cols) / 8;
  state.time = Math.floor(baseTime * timeMultiplier);
  
  updateTimerDisplay();
  startTimer();
  
  $("#ol").fadeOut(500);
  
  if (mode === 'logo') {
    createBoard(rows, cols, 1);
    dom.phaseIndicator.textContent = "1/1";
  } else if (mode === 'binary') {
    createBoard(rows, cols, 2);
    dom.phaseIndicator.textContent = "1/1";
  } else {
    createBoard(rows, cols, 1);
    dom.phaseIndicator.textContent = "1/2";
  }
}

// Create game board
function createBoard(rows, cols, phase) {
  $("table").html("");
  
  let items = [];
  if (phase === 1) {
    // Logo Match
    const logoItems = [...config.phase1.items].slice(0, state.totalPairs);
    items = [...logoItems, ...logoItems]; // Duplicate for pairs
  } else {
    // Binary Match
    const binaryItems = [...config.phase2.items].slice(0, state.totalPairs);
    binaryItems.forEach(item => {
      items.push({
        type: 'decimal',
        id: item.id,
        display: item.decimal,
        matchValue: item.binary
      });
      items.push({
        type: 'binary',
        id: item.id,
        display: item.binary,
        matchValue: item.decimal
      });
    });
  }
  
  shuffleArray(items);
  
  let cardId = 1;
  for (let r = 1; r <= rows; r++) {
    const row = $("<tr>");
    for (let c = 1; c <= cols; c++) {
      const item = items.pop();
      const card = $(`
        <td id='card-${cardId}' onclick="handleCardClick(this, ${cardId})">
          <div class='inner'>
            <div class='front'></div>
            <div class='back ${phase === 2 ? 'binary-card' : ''}'>
              ${phase === 1 ? 
                `<div class="image-container">${item.html}</div>` : 
                `<span>${item.display}</span>`
              }
            </div>
          </div>
        </td>
      `);
      
      // Store all card data
      card.data({
        id: cardId,
        cardId: item.id,
        display: item.display,
        type: phase === 1 ? 'logo' : item.type,
        matchValue: item.matchValue,
        matched: false
      });
      
      row.append(card);
      cardId++;
    }
    $("table").append(row);
  }
}

// Handle card click
function handleCardClick(cardElement, cardId) {
  if (state.lockBoard || $(cardElement).data('matched')) return;
  
  flipCard(cardElement);
  
  if (!state.firstCard) {
    state.firstCard = cardElement;
  } else {
    state.secondCard = cardElement;
    state.moves++;
    dom.movesDisplay.textContent = `Moves: ${state.moves}`;
    checkForMatch();
  }
}

// Flip card animation
function flipCard(cardElement) {
  const $card = $(cardElement);
  if ($card.data('matched')) return;
  
  $card.find('.inner').css('transform', 'rotateY(180deg)');
}

// Flip card back
function unflipCard(cardElement) {
  $(cardElement).find('.inner').css('transform', 'rotateY(0deg)');
}

// Check if cards match
function checkForMatch() {
  state.lockBoard = true;
  
  const card1 = $(state.firstCard);
  const card2 = $(state.secondCard);
  
  let match = false;
  
  if (state.currentPhase === 1) {
    // Logo Match - compare by cardId
    match = card1.data('cardId') === card2.data('cardId');
  } else {
    // Binary Match - must be one decimal and one binary with same id
    const isProperPair = (
      (card1.data('type') === 'decimal' && card2.data('type') === 'binary') ||
      (card1.data('type') === 'binary' && card2.data('type') === 'decimal')
    );
    
    match = isProperPair && (card1.data('cardId') === card2.data('cardId'));
  }
  
  if (match) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

// Handle matching cards
function handleMatch() {
  $(state.firstCard).data('matched', true);
  $(state.secondCard).data('matched', true);
  
  $(state.firstCard).find('.inner').addClass('matched');
  $(state.secondCard).find('.inner').addClass('matched');
  
  setTimeout(() => {
    $(state.firstCard).find('.inner').removeClass('matched');
    $(state.secondCard).find('.inner').removeClass('matched');
  }, 1000);

  state.matchedPairs++;
  updateScore(10);
  
  if (state.matchedPairs === state.totalPairs) {
    phaseComplete();
  }
  
  resetTurn();
}

// Handle mismatched cards
function handleMismatch() {
  $(state.firstCard).find('.inner').addClass('mismatch');
  $(state.secondCard).find('.inner').addClass('mismatch');
  
  setTimeout(() => {
    unflipCard(state.firstCard);
    unflipCard(state.secondCard);
    
    $(state.firstCard).find('.inner').removeClass('mismatch');
    $(state.secondCard).find('.inner').removeClass('mismatch');
    
    resetTurn();
  }, 1000);
}

// Reset turn state
function resetTurn() {
  setTimeout(() => {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
  }, 500);
}

// Update score
function updateScore(points) {
  state.score += points;
  dom.scoreDisplay.textContent = state.score;
}

// Start timer
function startTimer() {
  clearInterval(state.timerInterval);
  
  state.timerInterval = setInterval(() => {
    state.time--;
    updateTimerDisplay();
    
    if (state.time <= 0) {
      clearInterval(state.timerInterval);
      gameOver(false);
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  const minutes = Math.floor(state.time / 60);
  const seconds = state.time % 60;
  dom.timeDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Phase complete
function phaseComplete() {
  clearInterval(state.timerInterval);
  
  const timeBonus = Math.floor(state.time / 5);
  updateScore(timeBonus);
  
  if (state.gameMode === 'both' && state.currentPhase === 1) {
    dom.phaseResults.innerHTML = `
      <h3>Phase 1 Complete!</h3>
      <p>Moves: ${state.moves}</p>
      <p>Time Bonus: +${timeBonus} points</p>
      <p>Total Score: ${state.score}</p>
    `;
    $("#phase-transition").fadeIn();
  } else {
    gameOver(true);
  }
}

// Start next phase
function startNextPhase() {
  state.currentPhase = 2;
  state.matchedPairs = 0;
  state.moves = 0;
  dom.movesDisplay.textContent = `Moves: 0`;
  
  const rows = $("table tr").length;
  const cols = $("table tr:first td").length;
  const timeMultiplier = (rows * cols) / 8;
  state.time = Math.floor(120 * timeMultiplier);
  
  updateTimerDisplay();
  startTimer();
  
  createBoard(rows, cols, 2);
  $("#phase-transition").fadeOut();
}

// Game over
function gameOver(isWin) {
  if (isWin) {
    const timeBonus = Math.floor(state.time / 5);
    updateScore(timeBonus);
    
    saveToLeaderboard();
    
    showMessage(
      "🎉 Congratulations! 🎉",
      `You completed both phases!<br><br>
      Final Score: ${state.score}<br>
      Total Moves: ${state.moves}<br><br>
      <button onclick="showLeaderboard()">View Leaderboard</button>
      <button onclick="location.reload()">Play Again</button>`
    );
  } else {
    showMessage(
      "⏰ Time's Up!",
      `You didn't complete the phase in time.<br><br>
      Score: ${state.score}<br>
      <button onclick="location.reload()">Try Again</button>`
    );
  }
}

// Show message
function showMessage(title, content) {
  dom.messageBox.innerHTML = `
    <h2>${title}</h2>
    <div>${content}</div>
  `;
  dom.messageBox.style.display = 'block';
}

// Reset game state
function resetGame() {
  clearInterval(state.timerInterval);
  
  state.currentPhase = 1;
  state.score = 0;
  state.moves = 0;
  state.matchedPairs = 0;
  state.totalPairs = 0;
  state.firstCard = null;
  state.secondCard = null;
  state.lockBoard = false;
  state.gameMode = 'both';
  state.currentDifficulty = null;
  
  dom.scoreDisplay.textContent = '0';
  dom.movesDisplay.textContent = 'Moves: 0';
  dom.phaseIndicator.textContent = '1/2';
}

// Shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Leaderboard functions
function saveToLeaderboard() {
  const playerName = prompt("Enter your name for the leaderboard:", "Player");
  if (!playerName) return;
  
  const entry = {
    name: playerName,
    score: state.score,
    moves: state.moves,
    date: new Date().toLocaleDateString()
  };
  
  let leaderboard = JSON.parse(localStorage.getItem('memoryMasterLeaderboard') || '[]');
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) {
    leaderboard = leaderboard.slice(0, 10);
  }
  
  localStorage.setItem('memoryMasterLeaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('memoryMasterLeaderboard')) || [];
  
  let html = '<div class="leaderboard-header">';
  html += '<span>Rank</span><span>Name</span><span>Score</span><span>Moves</span>';
  html += '</div>';
  
  if (leaderboard.length === 0) {
    html += '<p>No entries yet. Be the first!</p>';
  } else {
    leaderboard.forEach((entry, index) => {
      html += `
        <div class="leaderboard-entry">
          <span>${index + 1}</span>
          <span>${entry.name}</span>
          <span>${entry.score}</span>
          <span>${entry.moves}</span>
        </div>
      `;
    });
  }
  
  dom.leaderboardResults.innerHTML = html;
  dom.leaderboardModal.style.display = 'flex';
}

function closeLeaderboard() {
  dom.leaderboardModal.style.display = 'none';
}

// Quit game
function quitGame() {
  if (confirm("Are you sure you want to quit?")) {
    resetGame();
    $("table").html("");
    $("#ol").fadeIn(500);
    $("#message-box").hide();
    $("#phase-transition").hide();
    $("#leaderboard-modal").hide();
  }
}

// Expose functions to global scope
window.startGame = startGame;
window.handleCardClick = handleCardClick;
window.startNextPhase = startNextPhase;
window.showLeaderboard = showLeaderboard;
window.closeLeaderboard = closeLeaderboard;
window.quitGame = quitGame;
window.selectMode = selectMode;