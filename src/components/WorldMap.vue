<script setup>
import { onMounted, watch } from "vue";
import {
  globeStyle,
  defaultStyle,
  mapColors,
} from "../../lib/mapping/mapStyles";
import windowManager from "../../stores/windowManager";
import airlineStore from "../../stores/airlineStore";
import { getAirportByCode } from "@/modules/dataProcessing";
import * as turf from "@turf/turf";
import greatCircle from "@turf/great-circle";

import maplibregl from "maplibre-gl";

let map = $ref();

const emptyGeoJSON = {
  type: "FeatureCollection",
  features: [],
};

function renderRoutes() {
  if (map.getSource("user_routes")) {
    map.getSource("user_routes").setData(emptyGeoJSON);
  }

  if (windowManager.showRoutesOnMap) {
    const routeFeatures = airlineStore.routeList.map((route, index) => {
      const from =  Object.values(getAirportByCode(route.startingAirport).coordinates).reverse();
      const to =  Object.values(getAirportByCode(route.endingAirport).coordinates).reverse();

      return greatCircle(from, to, {
        properties: { name: `route ${index}` },
        npoints: 100,
      });
    });

    const geojson = turf.featureCollection(routeFeatures);

    if (map.getSource("user_routes")) {
      map.getSource("user_routes").setData(geojson);
    }
  }
}

function generateMap() {
  if (typeof map?.remove === "function") {
    map.remove();
  }

  map = new maplibregl.Map({
    style: defaultStyle,
    center: [0, 0],
    zoom: 1,
    container: "map",
    attributionControl: false,
  });

  map.dragRotate.disable();

  map.on("load", () => {
    renderRoutes();
  });
}

onMounted(() => {
  generateMap();
});

watch(
  () => windowManager.showRoutesOnMap,
  () => {
    renderRoutes();
  }
);
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 1000px;
}
</style>
