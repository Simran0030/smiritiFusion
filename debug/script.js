// Timer functionality
let timerInterval;
let seconds = 0;
const timerDisplay = document.getElementById('timer');
const startTimerBtn = document.getElementById('start-timer');
const resetTimerBtn = document.getElementById('reset-timer');

function formatTime(secs) {
  const minutes = Math.floor(secs / 60);
  const remainingSeconds = secs % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      seconds++;
      timerDisplay.textContent = formatTime(seconds);
    }, 1000);
    startTimerBtn.textContent = 'Pause';
    startTimerBtn.classList.add('active');
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    startTimerBtn.textContent = 'Resume';
    startTimerBtn.classList.remove('active');
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  timerDisplay.textContent = formatTime(seconds);
  startTimerBtn.textContent = 'Start';
  startTimerBtn.classList.add('active');
}

startTimerBtn.addEventListener('click', startTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Game state
let currentLang = 'html';
let score = 0;
let level = 1;
let hintsUsed = 0;
const MAX_HINTS = 3;
const QUESTIONS_PER_LEVEL = 5;
let questionsAnswered = 0;

// DOM elements
const snippetContainer = document.getElementById('snippet-container');
const feedback = document.getElementById('feedback');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score-value');
const highscoreDisplay = document.getElementById('highscore');
const languageSelector = document.getElementById('language');
const nextButton = document.getElementById('next-btn');
const hintButton = document.getElementById('hint-btn');
const successSound = document.getElementById('success-sound');
const errorSound = document.getElementById('error-sound');

let currentSnippet = null;

// Complete snippets data
const snippetsByLang = {
  html: [
    {
      code: [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '  <title>My Page</title>',
        '</head>',
        '<body>',
        '  <h1>Welcome</h1>',
        '  <img scr="logo.png" alt="Logo">',
        '</body>',
        '</html>'
      ],
      bugLine: 7,
      explanation: "The 'scr' attribute in the img tag is misspelled. It should be 'src'."
    },
    {
      code: [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '  <meta charset="UTF-8">',
        '  <title>Document</title>',
        '</head>',
        '<body>',
        '  <div class="container">',
        '    <p>Hello world</p>',
        '  <div>',
        '</body>',
        '</html>'
      ],
      bugLine: 9,
      explanation: "The closing div tag is missing a forward slash. It should be '</div>'."
    }
  ],
  css: [
    {
      code: [
        'body {',
        '  font-family: Arial, sans-serif;',
        '  margin: 0;',
        '  padding: 0;',
        '  background-color: #f4f4f4;',
        '}',
        '',
        '.container {',
        '  width: 80%;',
        '  margin: auto;',
        '  overflow: hidden;',
        '}',
        '',
        '#header {',
        '  background: #333;',
        '  color: white;',
        '  padding: 10px;',
        '  border-radius: 5px',
        '}'
      ],
      bugLine: 16,
      explanation: "Missing semicolon at the end of the border-radius property."
    },
    {
      code: [
        '.button {',
        '  display: inline-block;',
        '  padding: 10px 20px;',
        '  background-color: blue;',
        '  color: white;',
        '  text-decoration: none;',
        '  border-radius: 5px;',
        '  transition: background-color 0.3s ease;',
        '}',
        '',
        '.button:hover {',
        '  background-color: darkblue;',
        '  cursor: point;',
        '}'
      ],
      bugLine: 12,
      explanation: "The cursor value 'point' is invalid. It should be 'pointer'."
    }
  ],
  js: [
    {
      code: [
        'function calculateTotal(price, quantity) {',
        '  const total = price * quantity;',
        '  return total;',
        '}',
        '',
        'function applyDiscount(total) {',
        '  if (total > 100) {',
        '    return total * 0.9;',
        '  } else {',
        '    retun total;',
        '  }',
        '}'
      ],
      bugLine: 9,
      explanation: "Misspelled 'return' keyword as 'retun'."
    },
    {
      code: [
        'const user = {',
        '  name: "John",',
        '  age: 30,',
        '  email: "john@example.com",',
        '  hobbies: ["reading", "swimming"]',
        '};',
        '',
        'console.log(user.hobbies.lenght);'
      ],
      bugLine: 8,
      explanation: "Misspelled 'length' property as 'lenght'."
    }
  ],
  python: [
    {
      code: [
        'def calculate_average(numbers):',
        '    total = sum(numbers)',
        '    count = len(numbers)',
        '    average = total / count',
        '    return averge',
        '',
        'nums = [10, 20, 30, 40, 50]',
        'print(calculate_average(nums))'
      ],
      bugLine: 4,
      explanation: "Misspelled 'average' as 'averge' in the return statement."
    },
    {
      code: [
        'class Person:',
        '    def __init__(self, name, age):',
        '        self.name = name',
        '        self.age = age',
        '    ',
        '    def greet(self):',
        '        print(f"Hello, my name is {self.name} and I am {self.age} years old")',
        '',
        'person = Person("Alice", 25)',
        'person.age = "30"',
        'print(person.age)'
      ],
      bugLine: 9,
      explanation: "Assigning a string to age when it should be a number (no quotes around 30)."
    }
  ],
  java: [
    {
      code: [
        'public class Main {',
        '    public static void main(String[] args) {',
        '        int x = 5;',
        '        int y = 10;',
        '        int sum = x + y',
        '        System.out.println("Sum: " + sum);',
        '    }',
        '}'
      ],
      bugLine: 5,
      explanation: "Missing semicolon at the end of the statement."
    },
    {
      code: [
        'import java.util.ArrayList;',
        '',
        'public class ShoppingCart {',
        '    private ArrayList<String> items;',
        '',
        '    public void addItem(String item) {',
        '        items.add(item)',
        '    }',
        '}'
      ],
      bugLine: 7,
      explanation: "Missing semicolon at the end of the items.add(item) statement."
    }
  ],
  c: [
    {
      code: [
        '#include <stdio.h>',
        '',
        'int main() {',
        '    int num1 = 10;',
        '    int num2 = 20;',
        '    int sum;',
        '    ',
        '    sum = num1 + num2',
        '    printf("Sum: %d\\n", sum);',
        '    ',
        '    return 0;',
        '}'
      ],
      bugLine: 8,
      explanation: "Missing semicolon at the end of the sum = num1 + num2 statement."
    },
    {
      code: [
        '#include <stdio.h>',
        '',
        'void printArray(int arr[], int size) {',
        '    for (int i = 0; i < size; i++) {',
        '        printf("%d ", arr[i]);',
        '    }',
        '    print("\\n");',
        '}'
      ],
      bugLine: 7,
      explanation: "Misspelled 'printf' as 'print'."
    }
  ]
};

// Load a random snippet for the current language
function loadSnippet() {
  const snippets = snippetsByLang[currentLang];
  
  if (!snippets || snippets.length === 0) {
    snippetContainer.innerHTML = '<div class="code-line">No snippets available for this language</div>';
    feedback.textContent = 'Please select another language';
    return;
  }
  
  currentSnippet = snippets[Math.floor(Math.random() * snippets.length)];

  snippetContainer.innerHTML = '';
  currentSnippet.code.forEach((line, index) => {
    const div = document.createElement('div');
    div.className = 'code-line';
    div.textContent = line;
    div.addEventListener('click', () => checkAnswer(index));
    snippetContainer.appendChild(div);
  });

  feedback.textContent = '';
}

// Check if the selected line is the bug
function checkAnswer(index) {
  const lines = document.querySelectorAll('.code-line');
  lines.forEach(line => line.classList.remove('correct', 'wrong'));

  if (index === currentSnippet.bugLine) {
    lines[index].classList.add('correct');
    feedback.textContent = `✅ Correct! ${currentSnippet.explanation}`;
    score += 10;
    questionsAnswered++;
    successSound.play().catch(e => console.log("Audio play failed:", e));
    
    if (questionsAnswered >= QUESTIONS_PER_LEVEL) {
      level += 1;
      questionsAnswered = 0;
      feedback.textContent = `🎉 Level Up! ${currentSnippet.explanation}`;
    }
  } else {
    lines[index].classList.add('wrong');
    feedback.textContent = `❌ Wrong! ${currentSnippet.explanation}`;
    score = Math.max(score - 5, 0);
    errorSound.play().catch(e => console.log("Audio play failed:", e));
  }

  levelDisplay.textContent = level;
  scoreDisplay.textContent = score;
  highscoreDisplay.textContent = Math.max(score, parseInt(highscoreDisplay.textContent));
}

// Show hint functionality
function showHint() {
  if (hintsUsed >= MAX_HINTS) {
    feedback.textContent = "❌ You've used all your hints!";
    errorSound.play().catch(e => console.log("Audio play failed:", e));
    return;
  }

  if (!currentSnippet) return;

  const lines = document.querySelectorAll('.code-line');
  const hintLine = currentSnippet.bugLine;
  
  lines[hintLine].style.animation = 'pulseHint 1.5s ease 3';
  feedback.textContent = `💡 Hint: Check line ${hintLine + 1}`;
  
  hintsUsed++;
  hintButton.textContent = `Hint (${MAX_HINTS - hintsUsed} left)`;
}

// Event listeners
languageSelector.addEventListener('change', () => {
  currentLang = languageSelector.value;
  score = 0;
  level = 1;
  questionsAnswered = 0;
  hintsUsed = 0;
  levelDisplay.textContent = level;
  scoreDisplay.textContent = score;
  hintButton.textContent = `Hint (${MAX_HINTS} left)`;
  resetTimer();
  loadSnippet();
});

nextButton.addEventListener('click', loadSnippet);
hintButton.addEventListener('click', showHint);

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
  hintButton.textContent = `Hint (${MAX_HINTS} left)`;
  loadSnippet();
  createParticles();
});

// Create floating particles
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.classList.add('particles-container');
  document.body.appendChild(particlesContainer);
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 5 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100 + 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    particlesContainer.appendChild(particle);
  }
}