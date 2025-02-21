import { state, scoreElement, restartButton } from "./js/state.js";
import { resetGame, animate } from "./js/functions.js";

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
