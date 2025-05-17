import { state, maxPoints } from "./state.js";

export default function stickHits() {
  const lastStick = state.sticks[state.sticks.length - 1];
  const stickFarX = lastStick.x + lastStick.length;
  let gameObject = {
    platform: null,
    points: 0,
  };
  const platformIndex = state.platforms.find((platform, index) => {
    if (platform.x < stickFarX && stickFarX < platform.x + platform.w) {
      // updating game object to a number of points that will be added to the score
      gameObject = {
        platform: platform,
        points: Math.min(index - state.indexReducer, maxPoints),
      };
      state.indexReducer = index;
    }
  });
  return gameObject;
}
