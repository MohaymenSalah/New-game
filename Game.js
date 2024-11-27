const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// إعدادات اللاعب
const player = { width: 50, height: 50, x: canvas.width / 2 - 25, y: canvas.height - 60, color: "blue", speed: 10 };

// قائمة العناصر الساقطة
const drops = [];
const dropImage = new Image();
dropImage.src = "https://example.com/glasses.png"; // ضع هنا رابط صورة النظارات
const dropSpeedBase = 3;

// نقاط اللعبة
let score = 0;
let timeLeft = 60; // وقت اللعبة 60 ثانية
let gameOver = false;

// إنشاء عنصر ساقط جديد
function createDrop() {
  const size = Math.random() * 40 + 30; // حجم عشوائي بين 30 و70
  drops.push({
    x: Math.random() * (canvas.width - size),
    y: 0,
    width: size,
    height: size,
    speed: dropSpeedBase + Math.random() * 2
  });
}

// تحديث النقاط
function updateScore() {
  const scoreDiv = document.getElementById("score");
  scoreDiv.textContent = `Score: ${score} - Time Left: ${timeLeft}s`;

  if (score >= 10) {
    scoreDiv.textContent += " - Congratulations! 10% discount!";
  }
  if (score >= 20) {
    scoreDiv.textContent += " - Wow! 20% discount!";
  }
  if (score >= 30) {
    scoreDiv.textContent += " - Amazing! 30% discount!";
  }
}

// عرض رسالة انتهاء اللعبة
function showGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// تحريك اللاعب
function movePlayer(event) {
  if (event.key === "ArrowLeft" && player.x > 0) {
    player.x -= player.speed;
  } else if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
}

document.addEventListener("keydown", movePlayer);

// تحديث العناصر الساقطة
function updateDrops() {
  drops.forEach((drop, index) => {
    drop.y += drop.speed;

    // إعادة العنصر إلى الأعلى إذا خرج من الشاشة
    if (drop.y > canvas.height) {
      drops.splice(index, 1);
      createDrop();
    }

    // التحقق من الاصطدام
    if (
      drop.x < player.x + player.width &&
      drop.x + drop.width > player.x &&
      drop.y + drop.height > player.y
    ) {
      score++;
      updateScore();
      drops.splice(index, 1);
      createDrop();
    }
  });
}

// تحديث الوقت
function updateTime() {
  if (gameOver) return;

  if (timeLeft > 0) {
    timeLeft--;
    updateScore();
  } else {
    gameOver = true;
    showGameOver();
  }
}

// رسم اللاعب والعناصر
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawDrops() {
  drops.forEach(drop => {
    ctx.drawImage(dropImage, drop.x, drop.y, drop.width, drop.height);
  });
}

// حلقة اللعبة
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    drawPlayer();
    drawDrops();
    updateDrops();
    requestAnimationFrame(gameLoop);
  }
}

// بدء اللعبة
updateScore();
setInterval(updateTime, 1000);
setInterval(createDrop, 2000); // إنشاء عنصر جديد كل ثانيتين
createDrop();
gameLoop();
