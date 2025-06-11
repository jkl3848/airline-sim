import { getDistance } from "geolib";
import {
  getAirplaneVariantByID,
  getAirportByCode,
} from "@modules/dataProcessing.js";
import airportList from "@data/airport_list.jsonc";

/**
 * Returns a list of all valid airports based on plane range from starting airport
 * @param {string} startingAirport Starting airport code
 * @param {object} airplaneType The airplane and variant ids
 * @returns {string[]} A list of all valid airports in range for the route
 */
export default function getValidEndAirport(
  startingAirportCode,
  startingAirportCoords,
  airplaneType
) {
  const airplaneVariant = getAirplaneVariantByID(
    airplaneType.planeID,
    airplaneType.variantID
  );
  const maxRange = airplaneVariant.specs.maxRange;

  const listOfValidAirportsCodes = [];

  for (let i = 0; i < airportList.length; i++) {
    const thisAirP = airportList[i];

    if (thisAirP.code !== startingAirportCode) {
      const distanceBetweenAirports = getAirportDistance(
        startingAirportCode,
        thisAirP.code
      );

      if (distanceBetweenAirports < maxRange) {
        listOfValidAirportsCodes.push(thisAirP.code);
      }
    }
  }

  return listOfValidAirportsCodes;
}

export function calcFlightArrivalTime(routeData, planeSpeed) {
  const routeDist = getAirportDistance(routeData.start, routeData.end);

  const flightTimeInHours = routeDist / planeSpeed;

  return flightTimeInHours * 3600000;
}

/**
 *
 * @param {string} startAirportCode Airport code
 * @param {string} endAirportCode Airport code
 * @returns {number} Distance in KM
 */
export function getAirportDistance(startAirportCode, endAirportCode) {
  const startAirport = getAirportByCode(startAirportCode);
  const endAirport = getAirportByCode(endAirportCode);

  return (
    getDistance(startAirport.coordinates, endAirport.coordinates, 1000) / 1000
  );
}

export function randomNumberGenerator(max, allowNegative = false) {
  const value = Math.floor(Math.random() * (max + 1));
  return allowNegative ? (Math.random() < 0.5 ? value : -value) : value;
}

export function getRouteDemand(
  startAirportCode,
  endAirportCode,
  routeDistance
) {
  const peakDemand = 800;
  const demandSpread = 600;

  const startAirport = getAirportByCode(startAirportCode);
  const endAirport = getAirportByCode(endAirportCode);

  const passengerFactor = Math.sqrt(
    startAirport.passengers * endAirport.passengers
  ); // geometric mean favors balanced airports
  const distanceFactor = Math.exp(
    -Math.pow((routeDistance - peakDemand) / demandSpread, 2)
  ); // Gaussian bell curve
  return passengerFactor * distanceFactor;
}
