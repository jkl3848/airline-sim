/* This is for main controls of the game such as starting the world clock,
 * setting up the user, etc.
 */
import createGameClock from "./worldClock.js";
import createEventQueue from "./eventQueue.js";

export default function startGame() {
  const clock = createGameClock({ tickInterval: 100, timeMultiplier: 60 });
  const events = createEventQueue();

  clock.onTick((currentTime) => {
    events.process(currentTime);
  });

  events.schedule(3600, () => console.log("Flight departs at 1 game hour"));
  events.schedule(86400, () => console.log("Salary paid at 1 game day"));

  clock.start();
}
