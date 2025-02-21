import {
  state,
  canvasHeight,
  canvasWidth,
  platformHeight,
  ctx,
  stretchingSpeed,
  turningSpeed,
  walkingSpeed,
  transitioningSpeed,
  fallingSpeed,
} from "./state.js";

export function resetGame() {
  // Reset game state
  phase = "waiting";
  state.lastTimestamp = undefined;

  // The first platform is always the same
  state.platforms = [{ x: 50, w: 50 }];
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();

  // Initialize hero position
  state.heroX = state.platforms[0].x + state.platforms[0].w - 30; // Hero stands a bit before the edge
  state.heroY = 0;

  // By how much should we shift the screen back
  state.sceneOffset = 0;

  // There's always a stick, even if it appears to be invisible (length: 0)
  sticks = [
    { x: state.platforms[0].x + state.platforms[0].w, length: 0, rotation: 0 },
  ];

  //Score
  score = 0;

  // Reset UI
  restartButton.style.display = "none"; // Hide reset button
  scoreElement.innerText = score; // Reset score display

  draw();
}

export function generatePlatform() {
  const minimumGap = 40;
  const maximumGap = 200;
  const minimumWidth = 20;
  const maximumWidth = 100;

  // X coordinate of the right edge of the furthest platform
  const lastPlatform = state.platforms[state.platforms.length - 1];
  let furthestX = lastPlatform.x + lastPlatform.w;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));
  const w =
    minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

  state.platforms.push({ x, w });
}
let sticks = [{ x: 100, length: 50, rotation: 60 }];
// DRAW
export function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Save the current transformation
  ctx.save();

  // Shifting the view
  ctx.translate(-state.sceneOffset, 0);

  // Draw scene
  drawPlatforms();
  drawHero();
  drawSticks();

  // Restore transformation to the last save
  ctx.restore();
}

export function drawPlatforms() {
  state.platforms.forEach(({ x, w }) => {
    // Draw platform
    ctx.fillStyle = "black";
    ctx.fillRect(x, canvasHeight - platformHeight, w, platformHeight);
  });
}

export function drawHero() {
  const heroWidth = 20;
  const heroHeight = 30;

  ctx.fillStyle = "red";
  ctx.fillRect(
    state.heroX,
    state.heroY + canvasHeight - platformHeight - heroHeight,
    heroWidth,
    heroHeight
  );
}

export function drawSticks() {
  sticks.forEach((stick) => {
    ctx.save();

    // Move the anchor point to the start of the stick and rotate
    ctx.translate(stick.x, canvasHeight - platformHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);

    // Draw stick
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -stick.length);
    ctx.stroke();

    // Restore transformations
    ctx.restore();
  });
}

export function animate(timestamp) {
  if (!state.lastTimestamp) {
    // First cycle
    state.lastTimestamp = timestamp;
    window.requestAnimationFrame(animate);
    return;
  }

  let timePassed = timestamp - state.lastTimestamp;

  switch (state.phase) {
    case "waiting":
      return; // Stop the loop
    case "stretching": {
      sticks[sticks.length - 1].length += timePassed / stretchingSpeed;
      break;
    }
    case "turning": {
      sticks[sticks.length - 1].rotation += timePassed / turningSpeed;

      if (sticks[sticks.length - 1].rotation >= 90) {
        sticks[sticks.length - 1].rotation = 90;

        const nextPlatform = thePlatformTheStickHits();
        if (nextPlatform) {
          score++;
          scoreElement.innerText = score;

          generatePlatform();
        }

        state.phase = "walking";
      }

      break;
    }
    case "walking": {
      state.heroX += timePassed / walkingSpeed;

      const nextPlatform = thePlatformTheStickHits();
      if (nextPlatform) {
        // If the hero will reach another platform then limit its position at its edge
        const maxHeroX = nextPlatform.x + nextPlatform.w - 30;
        if (state.heroX > maxHeroX) {
          state.heroX = maxHeroX;
          phase = "transitioning";
        }
      } else {
        // If the hero won't reach another platform then limit its position at the end of the pole
        const maxHeroX =
          sticks[sticks.length - 1].x + sticks[sticks.length - 1].length;
        if (state.heroX > maxHeroX) {
          state.heroX = maxHeroX;
          phase = "falling";
        }
      }

      break;
    }
    case "transitioning": {
      state.sceneOffset += timePassed / transitioningSpeed;

      const nextPlatform = thePlatformTheStickHits();
      if (nextPlatform.x + nextPlatform.w - state.sceneOffset < 100) {
        sticks.push({
          x: nextPlatform.x + nextPlatform.w,
          length: 0,
          rotation: 0,
        });
        phase = "waiting";
      }

      break;
    }
    case "falling": {
      state.heroY += timePassed / fallingSpeed;

      if (sticks[sticks.length - 1].rotation < 180) {
        sticks[sticks.length - 1].rotation += timePassed / turningSpeed;
      }

      const maxHeroY = platformHeight + 100;
      if (state.heroY > maxHeroY) {
        restartButton.style.display = "block";
        return;
      }

      break;
    }
  }
  draw();
  state.lastTimestamp = timestamp;

  window.requestAnimationFrame(animate);
}

function thePlatformTheStickHits() {
  const lastStick = sticks[sticks.length - 1];
  const stickFarX = lastStick.x + lastStick.length;

  const platformTheStickHits = state.platforms.find(
    (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
  );

  return platformTheStickHits;
}
