const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.game-board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const xWinsElement = document.getElementById('xWins');
const oWinsElement = document.getElementById('oWins');
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

let xWins = 0;
let oWins = 0;
let timer;
let computerChoice = 0;

const BOARD = new Board();

startGame();

restartButton.addEventListener('click', startGame);

function startGame() 
{
    BOARD.reset();
    // clear cell content and listeners
    cells.forEach(cell => 
    {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });

    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(e) 
{
    const cell = e.target;
    const currentClass = BOARD.isX ? X_CLASS : CIRCLE_CLASS;
    const canPlace = !hasAny(cell);
    const notOver = !isOver();

    if(canPlace && notOver)
    {
        placeMark(cell, currentClass);
        handleChoice();
    }
}

function handleChoice()
{
    const currentClass = BOARD.isX ? X_CLASS : CIRCLE_CLASS;
    if (BOARD._isOver) 
    {
        endGame(false);
        updateScore(currentClass);
    } 
    else if (BOARD.ply == 9) 
    {
        endGame(true);
    } 
    else 
    {
        setBoardHoverClass();
        if(BOARD.isO)
        {
            computerPlay();
        }
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
        winningMessageTextElement.innerText = `${BOARD.isO ? "X's" : "O's"} Wins!`; // previous player won
    }
    winningMessageElement.classList.add('show');
}

function computerPlay()
{
    let bestMove = BoardSearch.getBestMove(BOARD.clone());
    placeMark(cells[bestMove], BOARD.isX ? X_CLASS : CIRCLE_CLASS);
    handleChoice();
}

function placeMark(cell, currentClass) 
{
    cell.classList.add(currentClass);
    BOARD.makeMove(Array.from(cells).indexOf(cell));
}

function isOver()
{
    return winningMessageElement.classList.contains('show');
}

function hasAnyAt(cellIndex)
{
    return hasAny(cells[cellIndex]);
}

function hasAny(cell)
{
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
}

function setBoardHoverClass() 
{
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (BOARD.isX) 
    {
        board.classList.add(CIRCLE_CLASS);
    } else 
    {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) 
{
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function updateScore(winner) 
{
    if (winner === X_CLASS) {
        xWins++;
        xWinsElement.textContent = xWins;
    } else {
        oWins++;
        oWinsElement.textContent = oWins;
    }
}

