document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const gameContainer = document.getElementById('gameContainer');
    const scoreDisplay = document.getElementById('score');
    const playScreen = document.getElementById('playScreen');
    const playButton = document.getElementById('playButton');
    const gameOverScreen = document.getElementById('gameOver');
    const finalScore = document.getElementById('finalScore');
    const retryButton = document.getElementById('retryButton');

    const backgroundMusic = document.getElementById('backgroundMusic');
    const jumpSound = document.getElementById('jumpSound');
    
    let birdY;
    let gravity = 0.5;
    let birdVelocity;
    let isGameOver = false;
    let score = 0;
    let obstacleSpeed = 2;
    let gameLoopId;
    const gapHeight = 200; // Vertical gap between upper and lower obstacles
    const horizontalGap = 450; // Horizontal gap between each pair of obstacles

    function resetGame() {
        birdY = gameContainer.clientHeight / 2;
        birdVelocity = 0;
        bird.style.top = `${birdY}px`;
        score = 0;
        obstacleSpeed = 2;
        scoreDisplay.innerText = `Score: 0`;
        clearObstacles();
        isGameOver = false;
    }

    function startGame() {
        resetGame();
        gameOverScreen.style.display = 'none';
        playScreen.style.display = 'none';
        gameLoop();
        generateObstacles();
        backgroundMusic.play(); // Play background music when the game starts
    }

    function clearObstacles() {
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            obstacle.remove();
        });
    }

    function gameLoop() {
        if (isGameOver) return;
        
        birdVelocity += gravity;
        birdY += birdVelocity;
        bird.style.top = `${birdY}px`;
        
        if (birdY >= gameContainer.clientHeight - bird.clientHeight || birdY <= 0) {
            endGame();
        }
        
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            obstacle.style.left = `${parseFloat(obstacle.style.left) - obstacleSpeed}px`;
            if (parseFloat(obstacle.style.left) < -50) {
                obstacle.remove();
            }
            
            if (parseFloat(obstacle.style.left) + obstacle.clientWidth < bird.getBoundingClientRect().left && !obstacle.scored) {
                score++;
                obstacle.scored = true;
                scoreDisplay.innerText = `Score: ${Math.floor(score / 2)}`;
                obstacleSpeed += 0.1; // Increase difficulty
            }

            if (isCollision(bird, obstacle)) {
                endGame();
            }
        });
        
        gameLoopId = requestAnimationFrame(gameLoop);
    }
    
    function generateObstacles() {
        if (isGameOver) return;
        
        const obstacleTop = document.createElement('div');
        const obstacleBottom = document.createElement('div');
        const obstacleHeight = Math.random() * (gameContainer.clientHeight - gapHeight - 200) + 100;
        
        obstacleTop.classList.add('obstacle');
        obstacleTop.style.left = `${gameContainer.clientWidth}px`;
        obstacleTop.style.top = `0px`;  // Top side always at the top
        obstacleTop.style.height = `${obstacleHeight}px`;
        obstacleTop.style.width = '50px';
        obstacleTop.style.background = 'url("bamboo.png") no-repeat center center';
        obstacleTop.style.backgroundSize = 'cover'; // Ensure the bamboo image covers the div
        
        obstacleBottom.classList.add('obstacle');
        obstacleBottom.style.left = `${gameContainer.clientWidth}px`;
        obstacleBottom.style.bottom = `0px`; // Bottom side always at the bottom
        obstacleBottom.style.height = `${gameContainer.clientHeight - obstacleHeight - gapHeight}px`;
        obstacleBottom.style.width = '50px';
        obstacleBottom.style.background = 'url("bamboo.png") no-repeat center center';
        obstacleBottom.style.backgroundSize = 'cover'; // Ensure the bamboo image covers the div

        obstacleTop.scored = false; // Initialize score flag
        obstacleBottom.scored = false; // Initialize score flag
        
        gameContainer.appendChild(obstacleTop);
        gameContainer.appendChild(obstacleBottom);
        
        setTimeout(generateObstacles, horizontalGap / obstacleSpeed * 10); // Generate new obstacles after a certain horizontal gap
    }
    
    function isCollision(bird, obstacle) {
        const birdRect = bird.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        return !(
            birdRect.top > obstacleRect.bottom ||
            birdRect.bottom < obstacleRect.top ||
            birdRect.left > obstacleRect.right ||
            birdRect.right < obstacleRect.left
        );
    }
    
    function endGame() {
        isGameOver = true;
        finalScore.innerText = Math.floor(score / 2);
        gameOverScreen.style.display = 'block';
        cancelAnimationFrame(gameLoopId);
        backgroundMusic.pause(); // Pause the background music when the game ends
        backgroundMusic.currentTime = 0; // Reset the background music to the beginning
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isGameOver) {
            birdVelocity = -10;
            jumpSound.play(); // Play jump sound on space press
        }
    });

    document.addEventListener('touchstart', (e) => {
        if (!isGameOver) {
            birdVelocity = -10;
            jumpSound.play(); // Play jump sound on touch
        }
    });
    
    playButton.addEventListener('click', () => {
        playScreen.style.display = 'none';
        startGame();
    });
    
    retryButton.addEventListener('click', () => {
        location.reload(); // Refresh the page
    });
    
    playScreen.style.display = 'flex';  // Show play button on page load
});
