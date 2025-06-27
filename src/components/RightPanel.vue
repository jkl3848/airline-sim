<script setup>
import ToggleSwitch from "@/volt/ToggleSwitch.vue";
import { airlineStore } from "@stores/airlineStore.js";
import { windowManager } from "@stores/windowManager.js";
</script>

<template>
  <div id="right-panel">
    <Button
      @click="airlineStore.startNewAirline('Test Line')"
      label="New Airline"
    />
    <Button @click="windowManager.openPlanePanel()" label="Buy a Plane" />
    <Button @click="windowManager.openRoutePanel()" label="Make a Route" />
    <Button @click="windowManager.openSchedulerPanel()" label="Schedule a Flight" />

    <ToggleSwitch v-model="windowManager.showRoutesOnMap" /> Show Routes
    {{ windowManager.showRoutesOnMap }}
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
