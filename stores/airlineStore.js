import { reactive } from "vue";

export const airlineStore = reactive({
  userAirline: {
    name: "",
    money: 0,
    originCountryCode: "",
    originCountry: "",
    routes: [],
    airports: [],
    airplanes: [],
    employees: [],
  },
  otherAirlines: [],
  accruedWeeklyCosts: 0,
  routeList: [],

  startNewAirline(airlineName, startingCountry) {
    this.userAirline = {
      name: airlineName,
      money: 100000000,
      originCountryCode: "USA",
      originCountry: "United States",
      routes: [],
      airports: [],
      airplanes: [],
      employees: [],
    };
  },

  loadOtherAirlines() {},
});

export default airlineStore;
