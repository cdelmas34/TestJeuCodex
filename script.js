const boardElement = document.getElementById('board');
const teamsElement = document.getElementById('teams');
const rollBtn = document.getElementById('rollBtn');
const startTimerBtn = document.getElementById('startTimerBtn');
const showWordBtn = document.getElementById('showWordBtn');
const guessedBtn = document.getElementById('guessedBtn');
const failBtn = document.getElementById('failBtn');
const diceResultSpan = document.getElementById('diceResult');
const timerSpan = document.getElementById('timer');
const wordModal = document.getElementById('wordModal');
const wordDisplay = document.getElementById('wordDisplay');
const closeModalBtn = document.getElementById('closeModal');

const categories = ['yellow','blue','green','red','purple'];
const words = {
    yellow: ['chaise','stylo','tasse','voiture','ordinateur'],
    blue: ['chien','chat','professeur','docteur','lion'],
    green: ['courir','sauter','manger','lire','danser'],
    red: ['microscope','philosophie','astronaute','camouflage','hippopotame'],
    purple: ['libre']
};
const totalSquares = 30;
let board = [];
let positions = JSON.parse(localStorage.getItem('positions')) || [0,0];
let currentTeam = parseInt(localStorage.getItem('currentTeam') || '0');
let timerInterval;
let canRoll = false;
let currentWord = '';

function initBoard() {
    for(let i=0;i<totalSquares;i++) {
        const color = i === totalSquares -1 ? 'finish' : categories[i % categories.length];
        board.push(color);
        const square = document.createElement('div');
        square.className = `square ${color}`;
        square.id = 'sq'+i;
        square.textContent = i+1;
        boardElement.appendChild(square);
    }
    renderPawns();
    startTurn();
}

function renderPawns() {
    document.querySelectorAll('.pawn').forEach(p=>p.remove());
    positions.forEach((pos, index) => {
        const pawn = document.createElement('div');
        pawn.className = `pawn team${index}`;
        const square = document.getElementById('sq'+pos);
        if(square) square.appendChild(pawn);
    });
}

function updateTeamsDisplay() {
    teamsElement.textContent = `Tour de l\'équipe ${currentTeam+1}`;
}

function startTurn() {
    rollBtn.disabled = true;
    canRoll = false;
    diceResultSpan.textContent = '';
    showWordBtn.disabled = false;
    updateTeamsDisplay();
    if(positions[currentTeam] === totalSquares -1) {
        alert(`\u00c9quipe ${currentTeam+1} a gagn\u00e9 !`);
        return;
    }
    const color = board[positions[currentTeam]];
    const wordList = words[color === 'finish' ? 'yellow' : color];
    currentWord = wordList[Math.floor(Math.random()*wordList.length)];
    wordModal.classList.add('hidden');
}

function showWord() {
    wordDisplay.textContent = currentWord;
    wordModal.classList.remove('hidden');
    showWordBtn.disabled = true;
}

function rollDice() {
    if(!canRoll) return;
    const result = Math.floor(Math.random()*6)+1;
    diceResultSpan.textContent = `Dé: ${result}`;
    positions[currentTeam] += result;
    if(positions[currentTeam] >= totalSquares) positions[currentTeam] = totalSquares -1;
    renderPawns();
    if(positions[currentTeam] === totalSquares -1) {
        alert(`Équipe ${currentTeam+1} a gagné !`);
    }
    endTurn();
}

function startTimer() {
    let time = 60;
    timerSpan.textContent = time;
    clearInterval(timerInterval);
    timerInterval = setInterval(()=>{
        time--;
        timerSpan.textContent = time;
        if(time<=0) {
            clearInterval(timerInterval);
            timerSpan.textContent = '';
            fail();
        }
    },1000);
}

function guessed() {
    clearInterval(timerInterval);
    timerSpan.textContent = '';
    wordModal.classList.add('hidden');
    showWordBtn.disabled = true;
    rollBtn.disabled = false;
    canRoll = true;
}

function fail() {
    clearInterval(timerInterval);
    timerSpan.textContent = '';
    wordModal.classList.add('hidden');
    showWordBtn.disabled = true;
    endTurn();
}

function endTurn() {
    clearInterval(timerInterval);
    timerSpan.textContent = '';
    wordModal.classList.add('hidden');
    showWordBtn.disabled = true;
    rollBtn.disabled = true;
    canRoll = false;
    localStorage.setItem('positions', JSON.stringify(positions));
    currentTeam = (currentTeam +1) % positions.length;
    localStorage.setItem('currentTeam', currentTeam);
    renderPawns();
    startTurn();
}

rollBtn.addEventListener('click', rollDice);
startTimerBtn.addEventListener('click', startTimer);
guessedBtn.addEventListener('click', guessed);
failBtn.addEventListener('click', fail);
showWordBtn.addEventListener('click', showWord);
closeModalBtn.addEventListener('click', ()=> wordModal.classList.add('hidden'));

initBoard();
