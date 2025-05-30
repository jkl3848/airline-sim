/* This is for main controls of the game such as starting the world clock,
 * setting up the user, etc.
 */
import { clockStore } from "@stores/worldClock.js";
import createEventQueue from "./eventQueue.js";

export default function startGame() {
  clockStore.gameClock = clockStore.mainGameClock({
    tickInterval: 100,
    timeMultiplier: 6000,
  });
  const events = createEventQueue();

  clockStore.gameClock.onTick((currentTime) => {
    events.process(currentTime);
  });

  events.schedule(3600, () => console.log("Flight departs at 1 game hour"));
  events.schedule(86400, () => console.log("Salary paid at 1 game day"));

  clockStore.gameClock.onDayEnd((day) => {
    console.log(`End of game day ${day}`);
    // trigger salary payments, maintenance checks, etc.
  });

  clockStore.gameClock.start();
}
