/**
 * Creates an event queue for scheduling time-based callbacks.
 * @returns {{
 *   schedule: (timestamp: number, callback: () => void) => void,
 *   process: (currentTime: number) => void,
 *   getQueue: () => { timestamp: number, callback: () => void }[]
 * }}
 */
export default function createEventQueue() {
  let queue = [];

  function schedule(timestamp, callback) {
    queue.push({ timestamp, callback });
    queue.sort((a, b) => a.timestamp - b.timestamp);
  }

  function process(currentTime) {
    while (queue.length > 0 && queue[0].timestamp <= currentTime) {
      const { callback } = queue.shift();
      callback();
    }
  }

  function getQueue() {
    return [...queue];
  }

  return {
    schedule,
    process,
    getQueue,
  };
}
