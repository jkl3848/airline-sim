import { airlineStore } from "@stores/airlineStore.js";
import { economyStore } from "@stores/economyStore.js";
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
      eventQueue.schedule(thisFlight.arrive, () => completeFlight(thisFlight));
    });
  }
}

export function completeFlight(flightInfo) {
  airlineStore.userAirline.money += calculateRouteProfit(flightInfo);
  airlineStore.accruedWeeklyCosts += economyStore.fuelCost * routeDistance;
}

function calculateRouteProfit(flightInfo) {
  // TODO: this is just the formula, has no value currently
  const passengers =
    planeCapacity * routeDemand * economyStore.marketVolatility;
  const profit = passengers * ticketPrice;
  return profit;
}

export function getRouteByID(routeIDs){
  const matchedRoutes = []
  for (let i = 0; i < routeIDs.length; i++){
    matchedRoutes.push(airlineStore.routeList.find(item => item.routeID === routeIDs[i]))
  }

  return matchedRoutes
}