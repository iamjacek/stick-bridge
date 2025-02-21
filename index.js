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
} from "./js/state.js";
import { resetGame, animate } from "./js/functions.js";

// Further UI elements
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart");

window.addEventListener("mousedown", function () {
  if (state.phase == "waiting") {
    state.phase = "stretching";
    state.lastTimestamp = undefined;
    window.requestAnimationFrame(animate);
  }
});

window.addEventListener("mouseup", function () {
  if (state.phase == "stretching") {
    state.phase = "turning";
  }
});

restartButton.addEventListener("click", function (event) {
  resetGame();
  restartButton.style.display = "none";
});
