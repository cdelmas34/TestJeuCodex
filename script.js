const boardElement = document.getElementById('board');
const teamsElement = document.getElementById('teams');
const rollBtn = document.getElementById('rollBtn');
const startTimerBtn = document.getElementById('startTimerBtn');
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
let targetPosition;
let prevPosition;

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
    updateTeamsDisplay();
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

function rollDice() {
    const result = Math.floor(Math.random()*6)+1;
    diceResultSpan.textContent = `Dé: ${result}`;
    prevPosition = positions[currentTeam];
    targetPosition = positions[currentTeam] + result;
    if(targetPosition >= totalSquares) targetPosition = totalSquares -1;
    const color = board[targetPosition];
    const wordList = words[color === 'finish' ? 'yellow' : color];
    const word = wordList[Math.floor(Math.random()*wordList.length)];
    wordDisplay.textContent = word;
    wordModal.classList.remove('hidden');
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
    positions[currentTeam] = targetPosition;
    endTurn();
}

function fail() {
    positions[currentTeam] = prevPosition;
    endTurn();
}

function endTurn() {
    clearInterval(timerInterval);
    timerSpan.textContent = '';
    wordModal.classList.add('hidden');
    renderPawns();
    currentTeam = (currentTeam +1) % positions.length;
    localStorage.setItem('positions', JSON.stringify(positions));
    localStorage.setItem('currentTeam', currentTeam);
    updateTeamsDisplay();
}

rollBtn.addEventListener('click', rollDice);
startTimerBtn.addEventListener('click', startTimer);
guessedBtn.addEventListener('click', guessed);
failBtn.addEventListener('click', fail);
closeModalBtn.addEventListener('click', ()=> wordModal.classList.add('hidden'));

initBoard();
