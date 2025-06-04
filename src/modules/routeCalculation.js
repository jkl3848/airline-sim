import { getDistance } from "geolib";
import { getAirplaneVariantByID } from "@modules/dataProcessing.js";
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
      const distanceBetweenAirports = getDistance(startingAirportCoords, {
        latitude: thisAirP.latitude,
        longitude: thisAirP.longitude,
      });

      if (distanceBetweenAirports < maxRange) {
        listOfValidAirportsCodes.push(thisAirP.code);
      }
    }
  }

  return listOfValidAirportsCodes;
}
