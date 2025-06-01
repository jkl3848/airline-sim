import { reactive } from "vue";

export const eventQueue = reactive({
    dailyQueue: [],

    /**
     * Adds item to queue
     * @param {number} timestamp Enter timestamp in minutes in the day
     * @param {function} callback 
     */
   schedule(timestamp, callback) {
    eventQueue.dailyQueue.push({ timestamp: timestamp * 1000, callback });
    eventQueue.dailyQueue.sort((a, b) => a.timestamp - b.timestamp);
  },

  /**
   * Runs events that are still in the queue and time has passed
   * @param {number} currentTime 
   */
   process(currentTime) {
    while (eventQueue.dailyQueue.length > 0 && eventQueue.dailyQueue[0].timestamp <= currentTime) {
      const { callback } = eventQueue.dailyQueue.shift();
      callback();
    }
  },

});

export default eventQueue;
