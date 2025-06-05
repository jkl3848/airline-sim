import airportList from "@data/airport_list.jsonc";
import airplaneList from "@data/airplane_list.jsonc";

export function getAirportByCode(airportCode) {
  return airportList.find((airport) => airport.code === airportCode);
}

export function getAirplaneVariantByID(inputPlaneID, inputVarID) {
  return airplaneList
    .find((plane) => plane.planeID === inputPlaneID)
    .variants.find((variant) => variant.variantID === inputVarID);
}
