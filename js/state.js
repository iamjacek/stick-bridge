// Game state
export const state = {
  phase: "waiting", // waiting | stretching | turning | walking | transitioning | falling
  lastTimestamp: undefined, // The timestamp of the previous animation cycle

  heroX: undefined, // Changes when moving forward
  heroY: undefined, // Only changes when falling
  sceneOffset: undefined, // Moves the whole game

  platforms: [],
  sticks: [],

  score: 0,
};

// Configuration
const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");
export const canvasWidth = window.innerWidth;
export const canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

//platform sizing
export const minimumGap = 40;
export const maximumGap = 200;
export const minimumWidth = 20;
export const maximumWidth = 100;
export const platformHeight = 200;

// speed settings
export const stretchingSpeed = 4; // Milliseconds it takes to draw a pixel
export const turningSpeed = 4; // Milliseconds it takes to turn a degree
export const walkingSpeed = 4;
export const transitioningSpeed = 2;
export const fallingSpeed = 3;

export const restartButton = document.getElementById("restart");
export const scoreElement = document.getElementById("score");
