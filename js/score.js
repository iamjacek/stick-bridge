import { state } from "./state.js";

export const scoreElement = document.getElementById("score");
export const updateScore = (points) => {
  if (points > 0) {
    state.score = state.score + points;
    scoreElement.innerText = state.score;
  } else if (points === 0) {
    state.score = 0;
    state.indexReducer = 0;
    scoreElement.innerText = 0;
  }
};
