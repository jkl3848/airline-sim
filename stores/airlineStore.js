import { reactive } from "vue";

export const airlineStore = reactive({
  userAirline: {
    name: "",
    money: 0,
    originCountryCode: "",
    originCountry: "",
    // Standalone collections
    routes: [], // [{ id, start, end, distance, baseDemand }]
    flights: [], // [{ id, routeId, airplaneId, daysOfWeek:[0..6], departureMinutes, flightTimeMinutes, turnaroundMinutes }]
    airports: [],
    airplanes: [], // airplane objects include: { id, builder, family, variantName, planeID, variantID, specs, status }
    employees: [],
  },
  otherAirlines: [],
  accruedWeeklyCosts: 0,

  startNewAirline(airlineName, startingCountry) {
    this.userAirline = {
      name: airlineName,
      money: 100000000,
      originCountryCode: startingCountry || "USA",
      originCountry: "United States",
      routes: [],
      flights: [],
      airports: [],
      airplanes: [],
      employees: [],
    };
  },

  // Helper accessors (can be expanded later)
  getRouteById(id) {
    return this.userAirline.routes.find((r) => r.id === id);
  },
  getFlightsForDay(day) {
    return this.userAirline.flights.filter((f) => f.daysOfWeek.includes(day));
  },
  getAirplaneById(id) {
    return this.userAirline.airplanes.find((p) => p.id === id);
  },
  getFlightsForAirplaneAndDay(airplaneId, day) {
    return this.userAirline.flights.filter(
      (f) => f.airplaneId === airplaneId && f.daysOfWeek.includes(day)
    );
  },
  // Check availability for ALL provided days. Returns { ok:boolean, conflicts:[{day, flightId}] }
  isAirplaneAvailable(airplaneId, daysOfWeek, proposedStart, proposedEnd) {
    const conflicts = [];
    daysOfWeek.forEach((day) => {
      const dayFlights = this.getFlightsForAirplaneAndDay(airplaneId, day);
      for (const f of dayFlights) {
        const existingStart = f.departureMinutes;
        const existingEnd =
          f.departureMinutes + f.flightTimeMinutes + f.turnaroundMinutes;
        // Overlap if start < existingEnd && end > existingStart
        if (proposedStart < existingEnd && proposedEnd > existingStart) {
          conflicts.push({ day, flightId: f.id });
        }
      }
    });
    return { ok: conflicts.length === 0, conflicts };
  },

  loadOtherAirlines() {},
});

export default airlineStore;
