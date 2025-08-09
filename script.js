window.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {

        let boxes = document.querySelectorAll('.box');
        let turnStatus = document.getElementById('turn-status');
        let winnerMessage = document.getElementById('winner-message');
        let resetButton = document.getElementById('reset-button');

        function getValidName(playerLabel) {
            let name;
            while (true) {
                name = prompt(`Enter ${playerLabel}'s name:`);

                if (!name || name.trim() === '') {
                    alert(`${playerLabel}'s name cannot be empty. Using default name.`);
                    return playerLabel; // fallback default
                }

                name = name.trim();

                if (name.length > 10) {
                    alert(`${playerLabel}'s name is too long. Please enter again.`);
                    continue;
                }
                if (name.length < 3) {
                    alert(`${playerLabel}'s name is too short. Please enter again.`);
                    continue;
                }

                return name;
            }
        }

        // Get Player 1 and Player 2 names with validation
        let a = getValidName("Player 1");
        let b = getValidName("Player 2");

        // Ensure names are not same
        while (a === b) {
            alert("Player 1 and Player 2 cannot have the same name.");
            b = getValidName("Player 2");
        }

        let rand = Math.random();
        let choice;

        if (rand < 0.5) {
            choice = prompt(`${a}, choose your symbol (X or O):`).toUpperCase();
        } else {
            choice = prompt(`${b}, choose your symbol (X or O):`).toUpperCase();
        }

        while (choice !== 'X' && choice !== 'O') {
            alert("Invalid choice! Please enter X or O.");
            choice = prompt("Choose your symbol (X or O):").toUpperCase();
        }

        // Assign symbols
        let player1 = { name: a, symbol: choice };
        let player2 = { name: b, symbol: choice === 'X' ? 'O' : 'X' };

        let currentPlayer = rand < 0.5 ? player1 : player2;

        let initTurn = true;

        if (initTurn) {
            turnStatus.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
            initTurn = false;
        }

        let board = ["", "", "", "", "", "", "", "", ""];

        let gameOver = false;

        boxes.forEach((box, index) => {
            // Hover preview
            box.addEventListener('mouseenter', () => {
                if (!gameOver && board[index] === "") {
                    box.style.color = "rgba(255, 255, 255, 0.4)"; // faint white
                    box.textContent = currentPlayer.symbol;
                }
            });

            box.addEventListener('mouseleave', () => {
                if (board[index] === "") {
                    box.textContent = ""; // remove preview
                }
                box.style.color = ""; // reset style
            });

            box.addEventListener('click', () => {

                if (gameOver)
                    return;

                // Check if box is already filled
                if (board[index] !== "")
                    return;

                // Remove hover preview instantly on click
                box.textContent = "";
                box.style.color = "";

                // Place the symbol
                box.innerText = currentPlayer.symbol;
                board[index] = currentPlayer.symbol;

                // Check for a win
                let winningConditions = [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6]
                ];

                // Check for a winner
                for (let condition of winningConditions) {
                    if (board[condition[0]] === currentPlayer.symbol &&
                        board[condition[1]] === currentPlayer.symbol &&
                        board[condition[2]] === currentPlayer.symbol) {

                        for (let i = 0; i < 3; i++) {
                            boxes[condition[i]].classList.add('strike');
                        }

                        winnerMessage.textContent = `🎉 ${currentPlayer.name} wins! 🎉`;
                        winnerMessage.style.display = 'block';

                        gameOver = true;
                        turnStatus.style.display = 'none';
                    }
                    else if (!gameOver) {
                        // Check for a draw
                        if (!board.includes("")) {
                            winnerMessage.textContent = `It's a draw! 🤝`;
                            winnerMessage.style.display = 'block';
                            gameOver = true;
                            turnStatus.style.display = 'none';
                        }
                    }
                }

                // Switch player
                currentPlayer = (currentPlayer === player1) ? player2 : player1;

                // Update turn status
                turnStatus.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;

                resetButton.addEventListener('click', () => {

                    // Clear board UI & reset board array
                    boxes.forEach(box => {
                        box.classList.remove('strike');
                        box.textContent = "";
                        box.style.color = "";
                    });
                    board = ["", "", "", "", "", "", "", "", ""];

                    // Reset game state
                    gameOver = false;
                    winnerMessage.style.display = 'none';
                    turnStatus.style.display = 'block';
                    turnStatus.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
                });
            });
        });
    }, 100);
});