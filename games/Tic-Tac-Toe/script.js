document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('game-status');
    const resetBtn = document.getElementById('reset-btn');
    const pvpBtn = document.getElementById('pvp-btn');
    const pveBtn = document.getElementById('pve-btn');
    const resultModal = document.getElementById('result-modal');
    const resultText = document.getElementById('result-text');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    const scoreXElem = document.getElementById('score-x');
    const scoreOElem = document.getElementById('score-o');
    const scoreDrawElem = document.getElementById('score-draw');

    const scoreCardX = document.querySelector('.score-card.player-x');
    const scoreCardO = document.querySelector('.score-card.player-o');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp'; // 'pvp' or 'pve'
    let scores = { X: 0, O: 0, Draw: 0 };

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Initialize Game
    function init() {
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        resetBtn.addEventListener('click', resetBoard);
        playAgainBtn.addEventListener('click', resetBoard);
        pvpBtn.addEventListener('click', () => setMode('pvp'));
        pveBtn.addEventListener('click', () => setMode('pve'));
        
        updateScoreBoard();
        highlightActivePlayer();
    }

    function setMode(mode) {
        if (gameMode === mode) return;
        gameMode = mode;
        pvpBtn.classList.toggle('active', mode === 'pvp');
        pveBtn.classList.toggle('active', mode === 'pve');
        resetBoard();
    }

    function handleCellClick(e) {
        const index = e.target.getAttribute('data-index');

        if (board[index] !== '' || !gameActive) return;

        makeMove(index, currentPlayer);
        
        if (checkWin(currentPlayer)) {
            endGame(currentPlayer);
        } else if (checkDraw()) {
            endGame('Draw');
        } else {
            switchPlayer();
            if (gameMode === 'pve' && currentPlayer === 'O' && gameActive) {
                setTimeout(aiMove, 500);
            }
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        const cell = cells[index];
        cell.classList.add(player.toLowerCase());
        cell.setAttribute('data-mark', player);
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
        highlightActivePlayer();
    }

    function highlightActivePlayer() {
        scoreCardX.classList.toggle('active', currentPlayer === 'X');
        scoreCardO.classList.toggle('active', currentPlayer === 'O');
    }

    function checkWin(player) {
        return winConditions.some(condition => {
            return condition.every(index => board[index] === player);
        });
    }

    function checkDraw() {
        return board.every(cell => cell !== '');
    }

    function endGame(winner) {
        gameActive = false;
        if (winner === 'Draw') {
            scores.Draw++;
            resultText.textContent = "It's a Draw!";
            statusMessage.textContent = "Draw!";
        } else {
            scores[winner]++;
            resultText.textContent = `Player ${winner} Wins!`;
            statusMessage.textContent = `Player ${winner} Won!`;
        }
        
        updateScoreBoard();
        setTimeout(() => {
            resultModal.classList.add('show');
        }, 300);
    }

    function updateScoreBoard() {
        scoreXElem.textContent = scores.X;
        scoreOElem.textContent = scores.O;
        scoreDrawElem.textContent = scores.Draw;
    }

    function resetBoard() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => {
            cell.className = 'cell';
            cell.innerHTML = '';
            cell.removeAttribute('data-mark');
        });
        statusMessage.textContent = "Player X's Turn";
        resultModal.classList.remove('show');
        highlightActivePlayer();
    }

    // AI Logic (Minimax)
    function aiMove() {
        let bestScore = -Infinity;
        let move;

        // Try every possible move
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        makeMove(move, 'O');

        if (checkWin('O')) {
            endGame('O');
        } else if (checkDraw()) {
            endGame('Draw');
        } else {
            switchPlayer();
        }
    }

    const scoresMap = {
        X: -10,
        O: 10,
        Draw: 0
    };

    function minimax(board, depth, isMaximizing) {
        if (checkWin('O')) return scoresMap.O - depth;
        if (checkWin('X')) return scoresMap.X + depth;
        if (checkDraw()) return scoresMap.Draw;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    init();
});
