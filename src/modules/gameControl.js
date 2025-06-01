/* This is for main controls of the game such as starting the world clock,
 * setting up the user, etc.
 */
import { clockStore } from "@stores/worldClock.js";
import { eventQueue } from "@stores/eventQueue.js";

export default function startGame() {
  clockStore.gameClock = clockStore.mainGameClock({
    tickInterval: 100,
    timeMultiplier: 600,
  });

  clockStore.gameClock.onTick((currentTime) => {
    eventQueue.process(currentTime);
  });

  eventQueue.schedule(60, () => console.log("Flight departs at 1 game hour"));

  clockStore.gameClock.onDayEnd((day) => {
    console.log(`End of game day ${day} at ${clockStore.currentTime}`);
    // trigger salary payments, maintenance checks, etc.
  });

  clockStore.gameClock.start();
}
