<script setup>
import { airlineStore } from '@stores/airlineStore.js';
</script>

<template>
  <div id="route-panel">
        <h2>Create a route!</h2>
  </div>
</template>

<style scoped>
#route-panel {
  position: absolute;
  top: 10%;
  left: 25%;
  z-index: 150;

  height: 400px;
  width: 180px;

  background-color: white;
  color: black;
}
</style>
