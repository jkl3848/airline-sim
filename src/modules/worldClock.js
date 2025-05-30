/**
 * Creates a game clock that ticks forward in game time.
 * @param {Object} options
 * @param {number} [options.tickInterval=1000] - Real-time interval in milliseconds between ticks.
 * @param {number} [options.timeMultiplier=60] - Game seconds advanced per real second.
 * @returns {{
 *   start: () => void,
 *   pause: () => void,
 *   reset: () => void,
 *   onTick: (callback: (currentTime: number) => void) => void,
 *   getTime: () => number
 * }}
 */
export default function createGameClock({
  tickInterval = 1000,
  timeMultiplier = 60,
} = {}) {
  let currentTime = 0;
  let running = false;
  let interval = null;
  const listeners = [];

  function start() {
    if (running) return;
    running = true;
    interval = setInterval(tick, tickInterval);
  }

  function pause() {
    running = false;
    clearInterval(interval);
  }

  function reset() {
    currentTime = 0;
  }

  function tick() {
    currentTime += (tickInterval / 1000) * timeMultiplier;
    listeners.forEach((cb) => cb(currentTime));
  }

  function onTick(callback) {
    listeners.push(callback);
  }

  function getTime() {
    return currentTime;
  }

  return {
    start,
    pause,
    reset,
    onTick,
    getTime,
  };
}
