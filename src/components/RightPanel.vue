<script setup>
import { airlineStore } from "@stores/airlineStore.js"
import { windowManager } from "@stores/windowManager.js"
</script>

<template>
  <div id="right-panel">

    <button @click="airlineStore.startNewAirline('Test Line')">New Airline</button>
        <button @click="windowManager.openPlanePanel()">Buy Plane</button>
    <button @click="windowManager.openRoutePanel()">Create Route</button>

  </div>
</template>

<style scoped>
#right-panel {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;

  height: 100vh;
  width: 25vw;

  background-color: white;
  color: black;
}
</style>
