import { airlineStore } from "@stores/airlineStore.js";
import { economyStore } from "@stores/economyStore.js";
import { eventQueue } from "@stores/eventQueue.js";
import { getAirportDistance } from "@modules/calculationUtils.js";
import { getAirplaneVariantByID } from "@modules/dataProcessing.js";
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
  // Placeholder: mark airplane busy if needed
}

export function completeFlight(flightInfo) {
  const route = airlineStore.getRouteById(flightInfo.routeId);
  if (!route) return;
  const baseRevenue = route.baseDemand || 0;
  airlineStore.userAirline.money += baseRevenue * economyStore.marketVolatility;
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
  const airplane = airlineStore.getAirplaneById(airplaneId);
  if (!airplane) throw new Error("Airplane not found");

  // Determine distance and speed (km & km/h) for accurate time
  const distanceKm = route.distance || getAirportDistance(route.start, route.end);
  // Derive variant speed
  const variant = getAirplaneVariantByID(airplane.planeID, airplane.variantID);
  const cruiseSpeed = variant?.specs?.cruiseSpeed || 800; // km/h fallback
  // Block time (flight minutes)
  const flightTimeMinutes = Math.round((distanceKm / cruiseSpeed) * 60);
  const proposedStart = departureMinutes;
  const proposedEnd = departureMinutes + flightTimeMinutes + turnaroundMinutes;

  // Availability check
  const availability = airlineStore.isAirplaneAvailable(airplaneId, daysOfWeek, proposedStart, proposedEnd);
  if(!availability.ok){
    throw new Error("Scheduling conflict with flights: " + availability.conflicts.map(c => `${c.day}:${c.flightId.slice(0,6)}`).join(", "));
  }

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