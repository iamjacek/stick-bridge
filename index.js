import { state } from "./js/state.js";
import { animate } from "./js/phases.js";
import resetGame from "./js/reset.js";
export const restartButton = document.getElementById("restart");
resetGame();

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
