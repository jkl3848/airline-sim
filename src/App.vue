<script setup>
import WorldMap from "./components/WorldMap.vue";
import RightPanel from "./components/RightPanel.vue";

import startGame from "./modules/gameControl";

startGame();
</script>

<template>
  <div>
    <WorldMap />
  </div>
  <div>
    <RightPanel />
  </div>
</template>

<style scoped></style>
