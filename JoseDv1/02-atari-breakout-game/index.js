const $screen = document.getElementById("game-screen");
const $startButton = document.getElementById("start-btn");

$screen.width = 800;
$screen.height = 600;
const FPS = 60;

const ctx = $screen.getContext("2d");
ctx.fillStyle = "white";

// Objetos
class Ball {
	constructor() {
		this.position = { x: $screen.width / 2, y: $screen.height - 60 };
		this.speed = 2;
		this.speedVector = { x: this.speed, y: -this.speed };
		this.radius = 5;
	}

	draw() {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}

	move() {
		this.position.x += this.speedVector.x;
		this.position.y += this.speedVector.y;
	}

	collision() {
		// Paredes
		if (
			this.position.x + this.radius > $screen.width ||
			this.position.x - this.radius < 0
		) {
			this.speedVector.x = -this.speedVector.x;
		}

		// Techo
		if (this.position.y - this.radius < 0) {
			this.speedVector.y = -this.speedVector.y;
		}

		// Game over
		if (this.position.y + this.radius > $screen.height) {
			GameOver();
		}
	}
}

class Paddle {
	constructor() {
		this.width = 100;
		this.height = 10;
		this.position = {
			x: $screen.width / 2 - this.width / 2,
			y: $screen.height - 50,
		};
		this.speed = 10;
		this.movingLeft = false;
	}

	draw() {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.rect(this.position.x, this.position.y, this.width, this.height);
		ctx.fill();
		ctx.closePath();
	}

	move() {
		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft") {
				this.movingLeft = true;
			}
			if (e.key === "ArrowRight") {
				this.movingRight = true;
			}
		});

		document.addEventListener("keyup", (e) => {
			if (e.key === "ArrowLeft") {
				this.movingLeft = false;
			}
			if (e.key === "ArrowRight") {
				this.movingRight = false;
			}
		});

		if (this.movingLeft) {
			this.position.x -= this.speed;
		}
		if (this.movingRight) {
			this.position.x += this.speed;
		}
	}

	collision() {
		if (this.position.x < 0) {
			this.position.x = 0;
		}

		if (this.position.x + this.width > $screen.width) {
			this.position.x = $screen.width - this.width;
		}

		// Colision con la bola
		if (
			Game.ball.position.y + Game.ball.radius > this.position.y &&
			Game.ball.position.y + Game.ball.radius < this.position.y + this.height &&
			Game.ball.position.x > this.position.x &&
			Game.ball.position.x < this.position.x + this.width
		) {
			Game.ball.speedVector.y = -Game.ball.speedVector.y;
		}
	}
}

class Brick {
	constructor(position, color) {
		this.width = 100;
		this.height = 20;
		this.position = position;
		this.color = color;
		this.alive = true;
	}

	draw() {
		if (!this.alive) return;

		ctx.beginPath();
		ctx.rect(this.position.x, this.position.y, this.width, this.height);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	collision() {
		if (!this.alive) return;

		if (
			Game.ball.position.y - Game.ball.radius < this.position.y + this.height &&
			Game.ball.position.x > this.position.x &&
			Game.ball.position.x < this.position.x + this.width
		) {
			Game.ball.speedVector.y = -Game.ball.speedVector.y;
			this.alive = false;
		}

		if (
			Game.ball.position.y + Game.ball.radius < this.position.y &&
			Game.ball.position.x > this.position.x &&
			Game.ball.position.x < this.position.x + this.width
		) {
			console.log("colision");
			console.log(Game.ball.position.y + Game.ball.radius > this.position.y);

			Game.ball.speedVector.y = -Game.ball.speedVector.y;
			this.alive = false;
		}
	}
}

// Crear objetos
const Game = {
	ball: new Ball(),
	paddle: new Paddle(),
	bricks: [],
};

for (let i = 0; i < 8; i++) {
	for (let j = 0; j < 10; j++) {
		Game.bricks.push(
			new Brick(
				{ x: i * 100, y: j * 20 },
				`rgb(${255 - i * 30}, ${255 - j * 30}, ${i * 30})`
			)
		);
	}
}

Game.ball.draw();
Game.paddle.draw();
Game.bricks.forEach((brick) => brick.draw());

if (Game.bricks.every((brick) => !brick.alive)) {
	GameOver();
}

function Update() {
	// Limpiar pantalla
	ctx.clearRect(0, 0, $screen.width, $screen.height);
	// Dibujar objetos
	Game.ball.draw();
	Game.paddle.draw();
	Game.bricks.forEach((brick) => brick.draw());

	if (Game.bricks.every((brick) => !brick.alive)) {
		GameOver();
	}

	// Mover objetos
	Game.ball.move();
	Game.paddle.move();

	// Colisiones
	Game.ball.collision();
	Game.paddle.collision();
	Game.bricks.forEach((brick) => brick.collision());

	requestAnimationFrame(Update);
}

const startGame = () => {
	requestAnimationFrame(Update);
};

const GameOver = () => {
	ctx.font = "30px Arial";
	ctx.fillText("Game Over", $screen.width / 2 - 70, $screen.height / 2);
};

$startButton.addEventListener("click", startGame);
