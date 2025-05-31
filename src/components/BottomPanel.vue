<script setup>
import { clockStore } from "@stores/worldClock.js";
import { airlineStore } from "@stores/airlineStore.js"

const currentGameTime = $computed(() => {
  return new Date(
    clockStore.GAME_EPOCH.getTime() + clockStore.currentTime * 60
  );
});

const currentMoneyConverted = $computed(() => {
    return airlineStore.userAirline?.money?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
})
</script>

<template>
  <div id="bottom-panel">
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
<div>
    <table>
        <tr>
            <td>
                <h2>{{ airlineStore.userAirline.name }}</h2>
            </td>
            <td>
                <h4>{{ currentMoneyConverted }}</h4>
            </td>
        </tr>
        <tr>
            Planes: {{ airlineStore.userAirline.airplanes?.length }}
        </tr>
        <tr>
            Routes: {{ airlineStore.userAirline.routes?.length }}
        </tr>
        <tr>
            Employees: {{ airlineStore.userAirline.employees?.length }}
        </tr>
    </table>
</div>
  </div>
</template>

<style scoped>
#bottom-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;

  height: 20vh;
  width: 100vw;

  background-color: white;
  color: black;
}
</style>
