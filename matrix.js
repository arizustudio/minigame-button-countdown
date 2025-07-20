let score = 0, lives = 3, spawnInterval = 1500;
let gameLoop;
let gameActive = false;
const clickSound = new Audio("https://assets.mixkit.co/active_storage/sfx/900/900.wav");
const errorSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2042/2042.wav");
function updateScoreboard() {
	document.getElementById("scoreboard").innerHTML = `Skor: ${score} | ${"❤️".repeat(lives)}`;
}
function spawnCircle() {
	if (!gameActive) return;
	const gameArea = document.getElementById("game-area");
	const oldCircle = document.querySelector(".circle");
	if (oldCircle) {
		oldCircle.remove();
		if (gameActive) {
			lives--;
			errorSound.play();
			updateScoreboard();
			if (lives <= 0) return gameOver();
		}
	}
	const circle = document.createElement("div");
	circle.classList.add("circle");
	const x = Math.random() * (window.innerWidth - 60);
	const y = Math.random() * (window.innerHeight - 60);
	circle.style.left = x + "px";
	circle.style.top = y + "px";

	circle.innerHTML = `
    <svg class='countdown-ring'>
      <circle r='28' cx='30' cy='30'></circle>
    </svg>
  `;
	gameArea.appendChild(circle);
	setTimeout(() => {
		if (circle.parentElement && gameActive) {
			circle.remove();
			lives--;
			errorSound.play();
			updateScoreboard();
			if (lives <= 0) gameOver();
		}
	}, 3000);
	circle.addEventListener("click", (e) => {
		if (!gameActive) return;
		const rect = circle.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const dx = e.clientX - centerX;
		const dy = e.clientY - centerY;
		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance <= 50) {
			score++;
			clickSound.play();
			circle.remove();
			updateScoreboard();
			if (score % 7 === 0 && spawnInterval > 500) {
				clearInterval(gameLoop);
				spawnInterval -= 100;
				gameLoop = setInterval(spawnCircle, spawnInterval);
			}
		} else {
			errorSound.play();
			lives--;
			updateScoreboard();
			if (lives <= 0) gameOver();
		}
	});
}
function startGame() {
	score = 0;
	lives = 3;
	spawnInterval = 1500;
	updateScoreboard();
	document.getElementById("game-over").style.display = "none";
	gameActive = true;
	clearInterval(gameLoop);
	gameLoop = setInterval(spawnCircle, spawnInterval);
}
function gameOver() {
	clearInterval(gameLoop);
	gameActive = false;
	document.getElementById("final-score").textContent = `Your Score : ${score}`;
	document.getElementById("game-over").style.display = "flex";
}
function restartGame() {
	document.querySelectorAll(".circle").forEach(e => e.remove());
	startGame();
}
document.getElementById("start-button").addEventListener("click", () => {
	document.getElementById("start-popup").style.display = "none";
	startGame();
});
document.addEventListener("mousemove", function(e) {
	const cursor = document.getElementById("custom-cursor");
	cursor.style.left = e.clientX - 15 + "px";
	cursor.style.top = e.clientY - 15 + "px";
	const particle = document.createElement("div");
	particle.className = "cursor-particle";
	particle.style.left = e.clientX + "px";
	particle.style.top = e.clientY + "px";
	const dx = (Math.random() - 0.5) * 80 + "px";
	const dy = (Math.random() - 0.5) * 80 + "px";
	particle.style.setProperty('--dx', dx);
	particle.style.setProperty('--dy', dy);
	document.body.appendChild(particle);
	setTimeout(() => particle.remove(), 600);
});