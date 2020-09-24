export const add = (a, b) => a + b;
export const min = Math.min;
export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const frame = () =>
  new Promise((resolve) => requestAnimationFrame(resolve));
