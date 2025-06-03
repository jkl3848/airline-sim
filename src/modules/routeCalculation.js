import { getDistance } from "geolib";
import {
  getAirportByID,
  getAirplaneVariantByID,
} from "@modules/dataProcessing.js";

/**
 * Returns a list of all valid airports based on plane range from starting airport
 * @param {string} startingAirport Starting airport code
 * @param {object} airplaneType The airplane and variant ids
 * @returns {string[]} A list of all valid airports in range for the route
 */
function getValidEndAirport(startingAirport, airplaneType) {}
