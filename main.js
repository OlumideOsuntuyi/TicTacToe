const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.game-board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const xWinsElement = document.getElementById('xWins');
const oWinsElement = document.getElementById('oWins');
const timerElement = document.getElementById('timer');
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let circleTurn;
let xWins = 0;
let oWins = 0;
let timer;
let timeElapsed;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() 
{
    timeElapsed = 0;
    clearInterval(timer);
    timer = setInterval(() => 
    {
        updateTimer();
    }, 1000);

    cells.forEach(cell => 
    {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    
    swapTurns();
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
    updateTimer();
}

function handleClick(e) 
{
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) 
    {
        endGame(false);
        updateScore(currentClass);
    } 
    else if (isDraw()) 
    {
        endGame(true);
    } 
    else 
    {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) 
{
    clearInterval(timer);
    if (draw) 
    {
        winningMessageTextElement.innerText = 'Draw!';
    } 
    else 
    {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() 
{
    // returns true when all cells are occupied - tie situation
    return [...cells].every(cell => 
    {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) 
{
    cell.classList.add(currentClass);
}

function swapTurns() 
{
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function updateScore(winner) {
    if (winner === X_CLASS) {
        xWins++;
        xWinsElement.textContent = xWins;
    } else {
        oWins++;
        oWinsElement.textContent = oWins;
    }
}

function updateTimer() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timeElapsed++;
}
