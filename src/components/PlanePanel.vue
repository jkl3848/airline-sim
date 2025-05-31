<script setup>
import { airlineStore } from '@stores/airlineStore.js';
</script>

<template>
  <div id="airplane-panel">
        <h2>Buy an airplane!</h2>
  </div>
</template>

<style scoped>
#airplane-panel {
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
