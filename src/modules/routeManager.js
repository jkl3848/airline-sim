import { airlineStore } from "@stores/airlineStore.js";
import { economyStore } from "@stores/economyStore.js";
import { eventQueue } from "@stores/eventQueue.js";
import { getAirportDistance } from "@modules/calculationUtils.js";
import { v4 as uuidv4 } from "uuid";

// Generate events for flights scheduled on 'today' (0-6)
export default function generateDailyRoutes(today) {
  const todaysFlights = airlineStore.getFlightsForDay(today);
  todaysFlights.forEach((flight) => {
    // schedule departure event
    eventQueue.schedule(flight.departureMinutes, () => startFlight(flight));
    // schedule arrival event
    const arrival = flight.departureMinutes + flight.flightTimeMinutes;
    eventQueue.schedule(arrival, () => completeFlight(flight));
  });
}

export function startFlight(flightInfo) {
  // Placeholder for future: reduce availability, mark airplane busy, etc.
}

export function completeFlight(flightInfo) {
  // Simplified profit calc placeholder
  const route = airlineStore.getRouteById(flightInfo.routeId);
  if (!route) return;
  const baseRevenue = route.baseDemand || 0;
  airlineStore.userAirline.money += baseRevenue * economyStore.marketVolatility;
  // Fuel / cost accrual placeholder
  airlineStore.accruedWeeklyCosts += (route.distance || 0) * economyStore.fuelCost;
}

export function createRoute(startAirport, endAirport, distance, baseDemand) {
  const id = uuidv4();
  airlineStore.userAirline.routes.push({ id, start: startAirport, end: endAirport, distance, baseDemand });
  return id;
}

export function scheduleFlight({ routeId, airplaneId, daysOfWeek, departureMinutes, turnaroundMinutes = 60 }) {
  const route = airlineStore.getRouteById(routeId);
  if (!route) throw new Error("Route not found");
  // Estimate flight time (minutes) simple distance / 800kmh * 60
  const cruiseSpeed = 800; // TODO: pull from airplane variant
  const flightTimeMinutes = Math.round((route.distance / cruiseSpeed) * 60);
  const id = uuidv4();
  airlineStore.userAirline.flights.push({
    id,
    routeId,
    airplaneId,
    daysOfWeek: [...new Set(daysOfWeek)].sort(),
    departureMinutes,
    flightTimeMinutes,
    turnaroundMinutes,
  });
  return id;
}

export function getFlightsForRoute(routeId) {
  return airlineStore.userAirline.flights.filter(f => f.routeId === routeId);
}