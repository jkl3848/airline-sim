<script setup>
import { onMounted, ref } from "vue";
import {
  globeStyle,
  defaultStyle,
  mapColors,
} from "../../lib/mapping/mapStyles";

import maplibregl from "maplibre-gl";

let map = ref();

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
}

onMounted(() => {
  generateMap();
});
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
