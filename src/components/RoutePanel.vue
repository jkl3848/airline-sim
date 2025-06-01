<script setup>
import { airlineStore } from '@stores/airlineStore.js';
</script>

<template>
  <div id="route-panel">
        <h2>Create a route!</h2>

        <div>
          <table>
            <tbody>
              <tr v-for="(plane, index) in airlineStore.userAirline.airplanes">
                <td>
                  {{ plane.builder }} {{ plane.variantName }} {{ index + 1 }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  </div>
</template>

<style scoped>
#route-panel {
  position: absolute;
  top: 10%;
  left: 5%;
  z-index: 150;

  width: 80vw;
  max-width: 1200px;
  height: 70vh;

  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
</style>
