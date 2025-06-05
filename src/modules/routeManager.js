import airlineStore from "@stores/airlineStore";
import { eventQueue } from "@stores/eventQueue.js";

export default function generateDailyRoutes(today) {
  const allFlights = airlineStore.userAirline.routes
    .flatMap((route) => route.flights)
    .filter((flight) => flight.day === today);

  allFlights.array.forEach((thisFlight) => {
    eventQueue.schedule(thisFlight.arrive, () => completeFlight());
  });
}

export function completeFlight() {
  // generates money for user
}
