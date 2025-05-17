import { state, maxPoints } from "./state.js";
import { generatePlatform, draw } from "./draw.js";
import { updateScore } from "./score.js";
export const restartButton = document.getElementById("restart");

document.getElementById("maxPlatforms").innerText = maxPoints;

export default function resetGame() {
  // Reset game state
  state.phase = "waiting";
  state.lastTimestamp = undefined;
  instructions.style.opacity = 1;
  // The first platform is always the same
  state.platforms = [{ x: 50, w: 50 }];
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();
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
  state.sticks = [
    { x: state.platforms[0].x + state.platforms[0].w, length: 0, rotation: 0 },
  ];

  //Score
  updateScore(0);

  // Reset UI
  restartButton.style.display = "none"; // Hide reset button
  document.body.style.cursor = "pointer";

  draw();
}
