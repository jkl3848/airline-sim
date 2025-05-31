<script setup>
import { airlineStore } from '@stores/airlineStore.js';
import  airplaneList from "@data/airplane_list.jsonc"

console.log(airplaneList)
</script>

<template>
  <div id="airplane-panel">
    <h2 class="text-lg font-semibold mb-2 px-4 pt-4">Buy an airplane!</h2>
    <div class="table-wrapper">
      <table class="table-auto w-full border-collapse border border-gray-300 text-sm">
        <thead class="bg-gray-100 sticky top-0">
          <tr>
            <th class="border px-2 py-1">Plane</th>
            <th class="border px-2 py-1">Cost (USD)</th>
            <th class="border px-2 py-1">Crew (P/A)</th>
            <th class="border px-2 py-1">Max Passengers</th>
            <th class="border px-2 py-1">Max Cargo</th>
            <th class="border px-2 py-1">Fuel Capacity</th>
            <th class="border px-2 py-1">Range</th>
            <th class="border px-2 py-1">Speed (Max/Cruise)</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="plane in airplaneList" :key="plane.family">
            <tr v-for="variant in plane.variants" :key="variant.variantName">
              <td class="border px-2 py-1">{{ plane.builder }} {{ variant.variantName }}</td>
              <td class="border px-2 py-1">${{ variant.cost.toLocaleString() }}</td>
              <td class="border px-2 py-1">{{ variant.crew.pilots }} / {{ variant.crew.attendants }}</td>
              <td class="border px-2 py-1">{{ variant.specs.maxPassengers }}</td>
              <td class="border px-2 py-1">{{ variant.specs.cargoCapacity }}T</td>
              <td class="border px-2 py-1">{{ variant.specs.fuelCapacity }}</td>
              <td class="border px-2 py-1">{{ variant.specs.maxRange }}</td>
              <td class="border px-2 py-1">
                {{ variant.specs.maxSpeed }} / {{ variant.specs.cruiseSpeed }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
#airplane-panel {
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

.table-wrapper {
  height: calc(100% - 3rem);
  overflow: auto;
  padding: 0 1rem 1rem;
}
</style>
