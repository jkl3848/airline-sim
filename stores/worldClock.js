import { reactive } from "vue";

export const clockStore = reactive({
  GAME_EPOCH: new Date("2000-01-01T00:00:00Z"),
  currentTime: 0,
  gameClock: null,

  /**
   * Creates a game clock that ticks forward in game time.
   * Supports per-tick, per-day, per-week, per-month, and per-year callbacks.
   * @param {Object} options
   * @param {number} [options.tickInterval=100] - Real-time interval in milliseconds between ticks. (100 is 10 times a second)
   * @param {number} [options.timeMultiplier=600] - Game seconds advanced per tick. (600 means 6 minutes per tick?)
   * @returns {{
   *   start: () => void,
   *   pause: () => void,
   *   reset: () => void,
   *   onTick: (callback: (currentTime: number) => void) => void,
   *   onDayEnd: (callback: (dayNumber: number) => void) => void,
   *   onWeekEnd: (callback: (weekNumber: number) => void) => void,
   *   onMonthEnd: (callback: (monthNumber: number) => void) => void,
   *   onYearEnd: (callback: (yearNumber: number) => void) => void,
   *   getTime: () => number
   * }}
   */
  mainGameClock({ tickInterval = 1000, timeMultiplier = 60 } = {}) {
    let running = false;
    let interval = null;

    const tickListeners = [];
    const dayListeners = [];
    const weekListeners = [];
    const monthListeners = [];
    const yearListeners = [];

    let lastDay = 0;
    let lastWeek = 0;
    let lastMonth = 0;
    let lastYear = 0;

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
      clockStore.currentTime = 0;
      lastDay = 0;
      lastWeek = 0;
      lastMonth = 0;
      lastYear = 0;
    }

    function tick() {
      clockStore.currentTime += timeMultiplier;

      const currentDay = Math.floor(clockStore.currentTime / 864000);
      const currentWeek = Math.floor(currentDay / 7);
      const currentMonth = Math.floor(currentDay / 30);
      const currentYear = Math.floor(currentDay / 360);

      tickListeners.forEach((cb) => cb(clockStore.currentTime));

      if (currentDay > lastDay) {
        lastDay = currentDay;
        dayListeners.forEach((cb) => cb(currentDay));
      }
      if (currentWeek > lastWeek) {
        lastWeek = currentWeek;
        weekListeners.forEach((cb) => cb(currentWeek));
      }
      if (currentMonth > lastMonth) {
        lastMonth = currentMonth;
        monthListeners.forEach((cb) => cb(currentMonth));
      }
      if (currentYear > lastYear) {
        lastYear = currentYear;
        yearListeners.forEach((cb) => cb(currentYear));
      }
    }

    return {
      start,
      pause,
      reset,
      getTime: () => clockStore.currentTime,
      onTick: (cb) => tickListeners.push(cb),
      onDayEnd: (cb) => dayListeners.push(cb),
      onWeekEnd: (cb) => weekListeners.push(cb),
      onMonthEnd: (cb) => monthListeners.push(cb),
      onYearEnd: (cb) => yearListeners.push(cb),
    };
  },
});

export default clockStore;
