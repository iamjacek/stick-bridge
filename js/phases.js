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
  maximumWidth,
  minimumWidth,
  maximumGap,
  minimumGap,
  instructions,
} from "./state.js";
import { generatePlatform, draw } from "./draw.js";
import stickHits from "./stick-hits.js";
import { updateScore } from "./score.js";

export const restartButton = document.getElementById("restart");

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
      instructions.style.opacity = 0;
      state.sticks[state.sticks.length - 1].length +=
        timePassed / stretchingSpeed;

      break;
    }
    case "turning": {
      state.sticks[state.sticks.length - 1].rotation +=
        timePassed / turningSpeed;

      if (state.sticks[state.sticks.length - 1].rotation >= 90) {
        state.sticks[state.sticks.length - 1].rotation = 90;

        const nextPlatform = stickHits();
        console.log("next", nextPlatform);
        updateScore(nextPlatform.points);

        generatePlatform();

        state.phase = "walking";
      }

      break;
    }
    case "walking": {
      state.heroX += timePassed / walkingSpeed;

      const nextPlatform = stickHits();
      if (nextPlatform.platform) {
        // If the hero will reach another platform then limit its position at its edge
        const maxHeroX = nextPlatform.platform.x + nextPlatform.platform.w - 30;
        if (state.heroX > maxHeroX) {
          state.heroX = maxHeroX;
          state.phase = "transitioning";
        }
      } else {
        // If the hero won't reach another platform then limit its position at the end of the pole
        const maxHeroX =
          state.sticks[state.sticks.length - 1].x +
          state.sticks[state.sticks.length - 1].length;
        if (state.heroX > maxHeroX) {
          state.heroX = maxHeroX;
          state.phase = "falling";
        }
      }

      break;
    }
    case "transitioning": {
      state.sceneOffset += timePassed / transitioningSpeed;

      const nextPlatform = stickHits();

      if (
        nextPlatform.platform.x + nextPlatform.platform.w - state.sceneOffset <
        100
      ) {
        state.sticks.push({
          x: nextPlatform.platform.x + nextPlatform.platform.w,
          length: 0,
          rotation: 0,
        });
        state.phase = "waiting";
      }

      break;
    }
    case "falling": {
      state.heroY += timePassed / fallingSpeed;

      if (state.sticks[state.sticks.length - 1].rotation < 180) {
        state.sticks[state.sticks.length - 1].rotation +=
          timePassed / turningSpeed;
      }
      const maxHeroY =
        platformHeight + 100 + (window.innerHeight - canvasHeight) / 2;
      if (state.heroY > maxHeroY) {
        restartButton.style.display = "block";
        document.body.style.cursor = "default";
        return;
      }

      break;
    }
  }
  draw();
  state.lastTimestamp = timestamp;

  window.requestAnimationFrame(animate);
}
