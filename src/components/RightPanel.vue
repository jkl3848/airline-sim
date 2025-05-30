<script setup>
import { clockStore } from "@stores/worldClock.js";

const currentGameTime = $computed(() => {
  return new Date(
    clockStore.GAME_EPOCH.getTime() + clockStore.currentTime * 60
  );
});
</script>

<template>
  <div id="right-panel">
    <div>
      {{
        currentGameTime.toLocaleString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      }}
    </div>
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
