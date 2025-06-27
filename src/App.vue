<script setup>
import WorldMap from "./components/WorldMap.vue";
import RightPanel from "./components/RightPanel.vue";
import BottomPanel from "./components/BottomPanel.vue";
import PlanePanel from "./components/PlanePanel.vue";
import RoutePanel from "./components/RoutePanel.vue";
import RouteScheduler from "./components/RouteScheduler.vue";

import startGame from "./modules/gameControl";
import { windowManager } from "@stores/windowManager.js"

startGame();
</script>

<template>
  <div>
    <WorldMap />
  </div>
  <div>
    <RightPanel />
  </div>
  <div>
    <BottomPanel />
  </div>
  <RoutePanel />
  <PlanePanel />
  <RouteScheduler />
</template>

<style scoped></style>
