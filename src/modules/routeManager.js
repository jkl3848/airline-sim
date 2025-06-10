import airlineStore from "@stores/airlineStore";
import { eventQueue } from "@stores/eventQueue.js";

export default function generateDailyRoutes(today) {
  // console.log(today);
  // console.log(airlineStore.userAirline.routes);
  const allFlights = airlineStore.userAirline.routes
    .flatMap((route) => route.flights)
    .filter((flight) => flight.day === today);

  // console.log(allFlights);
  if (allFlights.length > 0) {
    allFlights.forEach((thisFlight) => {
      eventQueue.schedule(thisFlight.arrive, () => completeFlight());
    });
  }
}

export function completeFlight() {
  // generates money for user
}
