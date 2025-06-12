/* This is for main controls of the game such as starting the world clock,
 * setting up the user, etc.
 */
import { clockStore } from "@stores/worldClock.js";
import { eventQueue } from "@stores/eventQueue.js";
import { economyStore } from "@stores/economyStore.js";
import generateDailyRoutes from "./routeManager";
import airlineStore from "../../stores/airlineStore";

export default function startGame() {
  clockStore.gameClock = clockStore.mainGameClock(100, 600);

  clockStore.gameClock.onTick((currentTime) => {
    eventQueue.process(currentTime);
  });

  eventQueue.schedule(60, () => console.log("Flight departs at 1 game hour"));

  clockStore.gameClock.onDayEnd((day) => {
    console.log(`End of game day ${day} at ${clockStore.currentTime}`);
    generateDailyRoutes(day % 7);

    console.log(eventQueue);
    // trigger salary payments, maintenance checks, etc.
  });
  clockStore.gameClock.onWeekEnd((week) => {
    airlineStore.userAirline.money -= airlineStore.accruedWeeklyCosts;
    airlineStore.accruedWeeklyCosts = 0;
  });
  clockStore.gameClock.onMonthEnd((month) => {
    economyStore.getNewInflationRate();
    economyStore.adjustByInflation();
  });

  clockStore.gameClock.start();
}
