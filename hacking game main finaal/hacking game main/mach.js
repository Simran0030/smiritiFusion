// binary animation
function createBinaryRain() {
  const container = document.createElement('div');
  container.className = 'binary-rain';
  document.body.appendChild(container);
  
  const digits = '01';
  const columns = Math.floor(window.innerWidth / 20);
  
  for (let i = 0; i < columns; i++) {
    const delay = Math.random() * 5;
    const duration = 5 + Math.random() * 10;
    const left = (i * 20) + 'px';
    
    const digit = document.createElement('div');
    digit.className = 'binary-digit';
    digit.style.left = left;
    digit.style.animationDelay = delay + 's';
    digit.style.animationDuration = duration + 's';
    
    // Create initial digits
    let content = '';
    const digitCount = 5 + Math.floor(Math.random() * 10);
    for (let j = 0; j < digitCount; j++) {
      content += digits.charAt(Math.floor(Math.random() * digits.length)) + '<br>';
    }
    digit.innerHTML = content;
    
    container.appendChild(digit);
  }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', createBinaryRain);
//start
const sentences = [
  "HELLO WORLD", "SECRET CODE", "PYTHON ROCKS", "HACK THE PLANET", 
  "ACCESS GRANTED", "CYBER SECURITY", "PASSWORD STRONG", "ENCRYPT DATA",
  "DECODE MESSAGE", "VIRTUAL HACKING", "DIGITAL FORTRESS", "CODE BREAKER",
  "SECURE CHANNEL", "PRIVATE NETWORK", "CRYPTOGRAPHY", "ALGORITHM DESIGN",
  "DATA PROTECTION", "INFORMATION SAFE", "QUANTUM COMPUTING", "BLOCKCHAIN TECH"
];
let score = 0;
let currentTimer;
let currentChallenge = 0;
const totalChallenges = 3;
let timeLeft = 60;
let challengeStartTime = 0;

// Load leaderboard from localStorage
if (localStorage.getItem('leaderboard')) {
  document.getElementById('scores').innerHTML = localStorage.getItem('leaderboard');
}

// Theme management
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Set initial theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
}

function show(elementId) {
  document.getElementById("landingPage").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");
  document.getElementById("leaderboard").classList.add("hidden");
  document.getElementById(elementId).classList.remove("hidden");
}

function startGame() {
  score = 0;
  currentChallenge = 0;
  timeLeft = 60;
  show("game");
  
  // Create progress container
  const gameDiv = document.getElementById("game");
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressContainer.appendChild(progressBar);
  gameDiv.appendChild(progressContainer);
  
  updateProgress();
  caesarChallenge();
}

function updateProgress() {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    const progress = (currentChallenge / totalChallenges) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

function startTimer(callback, seconds = 60) {
  const gameDiv = document.getElementById("game");
  challengeStartTime = Date.now();
  
  // Create timer display
  const timerDisplay = document.createElement("div");
  timerDisplay.className = "time-display";
  timerDisplay.id = "timerDisplay";
  timerDisplay.textContent = `Time: ${seconds}s`;
  
  // Create timer bar container
  const timerContainer = document.createElement("div");
  timerContainer.className = "timer-container";
  const timerBar = document.createElement("div");
  timerBar.className = "timer-bar";
  timerContainer.appendChild(timerBar);
  
  // Add to game div
  gameDiv.prepend(timerDisplay);
  gameDiv.prepend(timerContainer);
  
  clearInterval(currentTimer);
  
  // Update timer bar width every 100ms for smoother animation
  const timerInterval = setInterval(() => {
    const elapsed = (Date.now() - challengeStartTime) / 1000;
    const remaining = Math.max(0, seconds - elapsed);
    timeLeft = Math.floor(remaining);
    timerBar.style.width = `${(remaining / seconds) * 100}%`;
    document.getElementById('timerDisplay').textContent = `Time: ${timeLeft}s`;
    
    if (remaining <= 10 && remaining > 0) {
      // Visual feedback when time is running out
      timerDisplay.style.color = remaining % 2 < 1 ? '#ff5555' : '';
    }
    
    if (remaining <= 0) {
      clearInterval(timerInterval);
      callback(false);
    }
  }, 100);
  
  currentTimer = timerInterval;
}

function caesarEncrypt(text, shift) {
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      let base = char === char.toUpperCase() ? 65 : 97;
      return String.fromCharCode((char.charCodeAt(0) - base + shift) % 26 + base);
    } else return char;
  }).join('');
}

function caesarDecrypt(text, shift) {
  return caesarEncrypt(text, 26 - shift);
}

function caesarChallenge() {
  currentChallenge = 1;
  updateProgress();
  
  const target = sentences[Math.floor(Math.random() * sentences.length)];
  const correctShift = Math.floor(Math.random() * 10) + 1;
  const correctEncrypted = caesarEncrypt(target, correctShift);

  let distractors = [];
  let usedShifts = new Set([correctShift]);
  while (distractors.length < 2) {
    let shift = Math.floor(Math.random() * 25) + 1;
    if (!usedShifts.has(shift)) {
      distractors.push(caesarEncrypt(target, shift));
      usedShifts.add(shift);
    }
  }

  let options = [correctEncrypted, ...distractors].sort(() => Math.random() - 0.5);

  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = `<div class='challenge'><h3>🔐 Caesar Cipher Challenge (1/3)</h3>
    <p>Which message decrypts to: "${target}"?</p></div>`;

  // Re-add progress container
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressContainer.appendChild(progressBar);
  gameDiv.prepend(progressContainer);
  updateProgress();

  options.forEach((text) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => {
      clearInterval(currentTimer);
      if (caesarDecrypt(text, correctShift) === target) {
        alert("✅ Correct!");
        score++;
      } else {
        alert("❌ Incorrect!");
      }
      currentChallenge++;
      regexChallenge();
    };
    gameDiv.appendChild(btn);
  });

  startTimer(() => {
    alert("⏰ Time's up!");
    currentChallenge++;
    regexChallenge();
  }, 60);
}

function regexChallenge() {
  currentChallenge = 2;
  updateProgress();
  
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = `<div class='challenge'><h3>🛡️ Regex Filter Challenge (2/3)</h3>
    <p>Create a username that meets these 3 requirements:</p>
    <ul>
      <li>🚫 Must NOT contain "admin" (case insensitive)</li>
      <li>🔢 Must contain at least 1 number</li>
      <li>⚡ Must be 6-12 characters long</li>
    </ul>
    <input id='usernameInput' placeholder='Enter your username' />
    <button onclick='checkRegex()'>Validate</button>
    <div id="regexFeedback" style="margin-top: 10px;"></div></div>`;

  // Re-add progress container
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressContainer.appendChild(progressBar);
  gameDiv.prepend(progressContainer);
  updateProgress();

  // Add real-time validation feedback
  document.getElementById('usernameInput').addEventListener('input', function() {
    validateRegexInput(this.value);
  });

  startTimer(() => {
    alert("⏰ Time's up!");
    currentChallenge++;
    cipherPairsChallenge();
  }, 60);
}

function validateRegexInput(value) {
  const feedbackDiv = document.getElementById("regexFeedback");
  feedbackDiv.innerHTML = '';
  
  const rules = [
    {
      pattern: /admin/i,
      requirement: "No 'admin'",
      valid: !/admin/i.test(value),
      message: "❌ Contains 'admin'"
    },
    {
      pattern: /[0-9]/,
      requirement: "Has number",
      valid: /[0-9]/.test(value),
      message: "❌ Needs a number"
    },
    {
      pattern: /^.{6,12}$/,
      requirement: "6-12 chars",
      valid: /^.{6,12}$/.test(value),
      message: "❌ Needs 6-12 chars"
    }
  ];

  // Display feedback
  rules.forEach(rule => {
    const p = document.createElement("p");
    p.style.margin = "2px 0";
    p.style.fontSize = "14px";
    p.textContent = rule.valid ? `✅ ${rule.requirement}` : rule.message;
    feedbackDiv.appendChild(p);
  });
}

function checkRegex() {
  clearInterval(currentTimer);
  const val = document.getElementById("usernameInput").value;
  
  // Validate the 3 requirements
  const isValid = !/admin/i.test(val) &&
                 /[0-9]/.test(val) &&
                 /^.{6,12}$/.test(val);

  if (isValid) {
    alert("✅ Perfect! Your username meets all requirements!");
    score++;
    currentChallenge++;
    cipherPairsChallenge();
  } else {
    alert("❌ Your username doesn't meet all requirements. Check the feedback below.");
  }
}
function cipherPairsChallenge() {
  currentChallenge = 3;
  updateProgress();
  
  const cipherPairs = [
    { name: "Caesar Cipher", symbol: "🔠", description: "Shifts letters by fixed number" },
    { name: "Vigenère", symbol: "🌀", description: "Uses keyword for shifting" },
    { name: "AES", symbol: "🔒", description: "Military-grade encryption" },
    { name: "RSA", symbol: "🔑", description: "Public-key cryptography" },
    { name: "Steganography", symbol: "👁️", description: "Hides messages in plain sight"},
    { name: "Pigpen Cipher", symbol: "🐷", description: "Uses geometric symbols for letters"},
    { name: "Morse Code", symbol: "📡", description: "Represents letters as dots and dashes"},
    { name: "Blowfish", symbol: "🐟", description: "Fast symmetric block cipher"},
    { name: "Base64", symbol: "📊", description: "Encodes binary data into ASCII text"},
    { name: "MD5", symbol: "🔄", description: "Cryptographic hash (insecure, used for checksums)"},
    { name: "SHA-256", symbol: "⚖️", description: "Secure hashing algorithm (used in Bitcoin)"},
    { name: "Bacon's Cipher", symbol: "🥓", description: "Hides messages in binary-like text"},
    { name: "Book Cipher", symbol: "📖", description: "Uses book text as a key for encoding"},
    { name: "One-Time pad", symbol: "🎭", description: "Unbreakable if used correctly"},
    { name: "Affine Cipher", symbol: "➗", description: "Uses mathematical functions for substitution"},
    { name: "QR Code", symbol: "📱", description: "2D barcode for encoding data"},
    { name: "Triple DES", symbol: "🔄3️⃣", description: "More secure version of DES"},
    { name: "ECC", symbol: "📈", description: "Efficient Public key Encryption"},
    { name: "ROT13", symbol: "🔄", description: "Special Caesar Cipher Shifting by 13 letters"},
    { name: "Hill Cipher", symbol: "⛰️", description: "Uses matrix multiplication for encryption"}
  ];

  // Select 3 random cipher pairs for the challenge
  const selectedPairs = [];
  while (selectedPairs.length < 3) {
    const randomPair = cipherPairs[Math.floor(Math.random() * cipherPairs.length)];
    if (!selectedPairs.includes(randomPair)) {
      selectedPairs.push(randomPair);
    }
  }

  let currentQuestion = 0;
  let correctAnswers = 0;

  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = `
    <div class='challenge'>
      <h3>🔠 Cipher Pairs Challenge (3/3)</h3>
      <p>Match the cipher name to its correct symbol:</p>
      <div id="current-question"></div>
      <div id="options-container" style="display: flex; gap: 10px; margin-top: 15px;"></div>
      <div id="pair-feedback" style="margin-top: 20px;"></div>
    </div>`;

  // Re-add progress container
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressContainer.appendChild(progressBar);
  gameDiv.prepend(progressContainer);
  updateProgress();

  function showQuestion() {
    const questionDiv = document.getElementById("current-question");
    const optionsDiv = document.getElementById("options-container");
    const feedbackDiv = document.getElementById("pair-feedback");
    
    questionDiv.innerHTML = `<p>${currentQuestion + 1}/3: What is the correct symbol for "${selectedPairs[currentQuestion].name}"?</p>`;
    optionsDiv.innerHTML = '';
    feedbackDiv.innerHTML = '';

    const currentPair = selectedPairs[currentQuestion];
    // Get 3 random symbols (1 correct, 2 incorrect)
    const options = [currentPair.symbol];
    while (options.length < 3) {
      const randomSymbol = cipherPairs[Math.floor(Math.random() * cipherPairs.length)].symbol;
      if (!options.includes(randomSymbol) && randomSymbol !== currentPair.symbol) {
        options.push(randomSymbol);
      }
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    options.forEach(symbol => {
      const btn = document.createElement("button");
      btn.textContent = symbol;
      btn.onclick = () => {
        if (symbol === currentPair.symbol) {
          feedbackDiv.innerHTML = `
            <div class="feedback-correct">
              ✅ Correct! ${currentPair.name} ${currentPair.symbol}: ${currentPair.description}
            </div>
          `;
          correctAnswers++;
          score++;
        } else {
          feedbackDiv.innerHTML = `
            <div class="feedback-incorrect">
              ❌ Incorrect! The correct symbol was ${currentPair.symbol}
            </div>
          `;
        }
      // Disable all buttons after selection
        optionsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
        
        // Show next button or finish challenge
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next Question";
        nextButton.style.marginTop = "20px";
        nextButton.onclick = () => {
          currentQuestion++;
          if (currentQuestion < selectedPairs.length) {
            showQuestion();
          } else {
            clearInterval(currentTimer);
            showScore();
          }
        };
        feedbackDiv.appendChild(nextButton);
      };
      optionsDiv.appendChild(btn);
    });
  }
  // Start with the first question
  showQuestion();
  startTimer(() => {
    alert("⏰ Time's up!");
    showScore();
  }, 60);
}


      // Highlight selected button
      {
      document.querySelector(`button[data-index="${index}"]`).style.backgroundColor = "#00ffcc";
      document.querySelector(`button[data-index="${index}"]`).style.color = "#000";
    }

      // Check if we have one name and one symbol selected
      if (selected.type !== type) {
        const first = selected.type === 'name' ? 
          cipherPairs[selected.index] : shuffled[selected.index];
        const second = type === 'symbol' ? 
          shuffled[index] : cipherPairs[index];
        
        if (first.name === second.name && first.symbol === second.symbol) {
          // Correct match
          document.querySelectorAll(`button[data-index="${selected.index}"], button[data-index="${index}"]`)
            .forEach(btn => {
              btn.style.backgroundColor = "#00cc00";
              btn.disabled = true;
            });
          score++;
        } else {
          // Incorrect match
          document.querySelectorAll(`button[data-index="${selected.index}"], button[data-index="${index}"]`)
            .forEach(btn => {
              btn.style.backgroundColor = "#cc0000";
              setTimeout(() => {
                btn.style.backgroundColor = "";
                btn.style.color = "";
              }, 1000);
            });
        }
      }
      // Reset selection
      selected = null;
      
      // Check if all pairs are matched
      if (document.querySelectorAll('button:disabled').length === cipherPairs.length * 2) {
        setTimeout(() => {
          clearInterval(currentTimer);
          showScore();
        }, 500);
      }

  startTimer(() => {
    alert("⏰ Time's up!");
    showScore();
  }, 60);

  // Re-add progress container
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressContainer.appendChild(progressBar);
  gameDiv.prepend(progressContainer);
  updateProgress();

  startTimer(() => {
    alert("⏰ Time's up!");
    showScore();
  }, 60);

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = `${Math.random() * 10 + 5}px`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.body.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

function showScore() {
  const name = prompt("Enter your hacker alias for the leaderboard:");
  if (name) {
    const entry = document.createElement("div");
    entry.className = "score-entry";
    entry.innerHTML = `
      <span>${name}</span>
      <span>Score: ${score}/5</span>
      <span>Time Left: ${timeLeft}s</span>
    `;
    
    const scoresDiv = document.getElementById("scores");
    scoresDiv.prepend(entry);
    
    // Save to localStorage
    localStorage.setItem('leaderboard', scoresDiv.innerHTML);
    
    // Show confetti for perfect score
    if (score === totalChallenges) {
      createConfetti();
    }
  }
  show("leaderboard");
}

function clearLeaderboard() {
  if (confirm("Are you sure you want to clear the leaderboard?")) {
    document.getElementById('scores').innerHTML = '';
    localStorage.removeItem('leaderboard');
  }
}