<script setup>
import { onMounted, ref, watch } from "vue";
import {
  globeStyle,
  defaultStyle,
  mapColors,
} from "../../lib/mapping/mapStyles";
import windowManager from "../../stores/windowManager";
import airlineStore from "../../stores/airlineStore";
import { getAirportByCode } from "@/modules/dataProcessing";
import * as turf from "@turf/turf";

import maplibregl from "maplibre-gl";

let map = ref();

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
      const coords = [
        Object.values(getAirportByCode(route.startingAirport).coordinates),
        Object.values(getAirportByCode(route.endingAirport).coordinates),
      ];

      return turf.lineString(coords, { name: `route ${index}` });
    });

    const geojson = turf.featureCollection(routeFeatures);

    console.log(geojson);

    if (map.getSource("user_routes")) {
      map.getSource("user_routes").setData(geojson);
    }
  }
}

function generateMap() {
  if (typeof map.remove === "function") {
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
