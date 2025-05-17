import {
  state,
  ctx,
  canvasHeight,
  canvasWidth,
  platformHeight,
  maximumWidth,
  minimumWidth,
  minimumGap,
  maximumGap,
} from "./state.js";

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
  state.sticks.forEach((stick) => {
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

export function generatePlatform() {
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
