window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const boxes = document.querySelectorAll('.box');
        const turnStatus = document.getElementById('turn-status');
        const winnerMessage = document.getElementById('winner-message');
        const resetButton = document.getElementById('reset-button');

        const player1NameEl = document.getElementById('player1-name');
        const player2NameEl = document.getElementById('player2-name');
        const player1SymbolEl = document.getElementById('player1-symbol');
        const player2SymbolEl = document.getElementById('player2-symbol');
        const player1Card = document.getElementById('player1-card');
        const player2Card = document.getElementById('player2-card');

        const moveSound = document.getElementById('move-sound');
        const winSound = document.getElementById('win-sound');

        function safePlay(sound) {
            try {
                sound.currentTime = 0;
                sound.play();
            } catch(e) {}
        }

        function getValidName(playerLabel) {
            let name;
            while (true) {
                name = prompt(`Enter ${playerLabel}'s name:`);

                if (!name || name.trim() === '') {
                    alert(`${playerLabel}'s name cannot be empty. Using default name.`);
                    return playerLabel;
                }

                name = name.trim();
                if (name.length < 3) { alert("Too short"); continue; }
                if (name.length > 10) { alert("Too long"); continue; }
                return name;
            }
        }

        let a = getValidName("Player 1");
        let b = getValidName("Player 2");
        while (a === b) {
            alert("Names cannot match");
            b = getValidName("Player 2");
        }

        let rand = Math.random();
        let choice = rand < 0.5 ?
            prompt(`${a} choose X or O:`).toUpperCase() :
            prompt(`${b} choose X or O:`).toUpperCase();

        while (choice !== "X" && choice !== "O") {
            choice = prompt("Choose X or O:").toUpperCase();
        }

        let player1 = { name: a, symbol: choice };
        let player2 = { name: b, symbol: choice === "X" ? "O" : "X" };

        player1NameEl.textContent = player1.name;
        player2NameEl.textContent = player2.name;
        player1SymbolEl.textContent = player1.symbol;
        player2SymbolEl.textContent = player2.symbol;

        let currentPlayer = rand < 0.5 ? player1 : player2;

        function updateActive() {
            player1Card.classList.toggle("active", currentPlayer === player1);
            player2Card.classList.toggle("active", currentPlayer === player2);
        }
        updateActive();

        turnStatus.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;

        let board = Array(9).fill("");
        let gameOver = false;

        const winningConditions = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];

        resetButton.addEventListener("click", () => {
            boxes.forEach(b => {
                b.textContent = "";
                b.classList.remove("strike","placed");
                b.style.color = "";
            });
            board.fill("");
            gameOver = false;
            winnerMessage.style.display = "none";
            turnStatus.style.display = "block";
            turnStatus.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
            updateActive();
        });

        boxes.forEach((box, i) => {
            box.addEventListener("mouseenter", () => {
                if (!gameOver && board[i] === "") {
                    box.style.color="rgba(255,255,255,0.4)";
                    box.textContent=currentPlayer.symbol;
                }
            });
            box.addEventListener("mouseleave", () => {
                if (board[i] === "") box.textContent="";
                box.style.color="";
            });

            box.addEventListener("click", () => {
                if (gameOver || board[i] !== "") return;

                box.textContent=currentPlayer.symbol;
                box.style.color="";
                box.classList.add("placed");
                board[i]=currentPlayer.symbol;

                safePlay(moveSound);

                for (let condition of winningConditions) {
                    if (
                        board[condition[0]] === currentPlayer.symbol &&
                        board[condition[1]] === currentPlayer.symbol &&
                        board[condition[2]] === currentPlayer.symbol
                    ) {
                        condition.forEach(idx => {
                            boxes[idx].classList.add("strike");
                        });

                        winnerMessage.textContent = `🎉 ${currentPlayer.name} wins! 🎉`;
                        winnerMessage.style.display="block";
                        turnStatus.style.display="none";
                        safePlay(winSound);
                        gameOver=true;
                        return;
                    }
                }

                if (!board.includes("") && !gameOver) {
                    winnerMessage.textContent = `It's a draw! 🤝`;
                    winnerMessage.style.display="block";
                    turnStatus.style.display="none";
                    safePlay(winSound);
                    gameOver=true;
                    return;
                }

                currentPlayer = currentPlayer === player1 ? player2 : player1;
                turnStatus.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
                updateActive();
            });
        });
    },100);
});
