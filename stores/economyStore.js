import { reactive } from "vue";
import { randomNumberGenerator } from "@modules/calculationUtils";

export const economyStory = reactive({
  fuelCost: 4, // Price per gallon
  minimumWage: 400, // Salary per week minimum.
  currentInflationRate: 0, // A percent that other costs will be adjusted based on. Changes monthly.
  marketVolatility: 0, // A number 0-10 showing how much items can vary off of the inflation rate.

  getNewInflationRate() {
    this.currentInflationRate +=
      this.currentInflationRate +
      randomNumberGenerator(this.marketVolatility, true);
  },

  adjustByInflation() {
    const inflationPerc = this.currentInflationRate / 100;
    this.fuelCost = this.fuelCost * (inflationPerc + volatilityRate());
  },

  volatilityRate() {
    return randomNumberGenerator(this.marketVolatility, true) / 100;
  },
});

export default economyStory;
