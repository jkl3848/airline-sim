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
    airplanes: [],
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

  loadOtherAirlines() {},
});

export default airlineStore;
