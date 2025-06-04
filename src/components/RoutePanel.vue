<script setup>
import { airlineStore } from "@stores/airlineStore.js";
import { windowManager } from "@stores/windowManager.js";
import airportList from "@data/airport_list.jsonc";

import { FilterMatchMode } from "@primevue/core/api";
import { onMounted } from "vue";
import getValidEndAirport from "@/modules/routeCalculation";

const filters = $ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

let viewPlanePicker = $ref(false);
let viewRouteCreator = $ref(false);

const planeSelection = $ref();

function getRouteEndOptions() {
  getValidEndAirport();
}

onMounted(() => {
  viewPlanePicker = true;
});
</script>

<template>
  <Dialog
    v-model:visible="windowManager.routePanelOpen"
    modal
    header="Create a Route!"
  >
    <div
      v-if="airlineStore.userAirline?.airplanes?.length > 0 && viewPlanePicker"
    >
      <DataTable
        v-model:filters="filters"
        :value="airlineStore.userAirline.airplanes"
        v-model:selection="planeSelection"
        selection-mode="single"
        dataKey="planeID"
        tableStyle="min-width: 60rem"
      >
        <template #header>
          <div class="flex flex-wrap justify-end gap-2">
            <div class="relative">
              <i
                class="pi pi-search absolute top-1/2 -mt-2 text-surface-400 leading-none end-3 z-1"
              />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search"
              />
            </div>
          </div>
        </template>

        <Column header="Builder" sortable>
          <template #body="planeProps">
            {{ planeProps.data.builder }} {{ planeProps.data.family }}
          </template>
        </Column>
        <Column field="size" header="Size" sortable></Column>
        <Column field="size" header="Usage" sortable></Column>
        <Column field="crew" header="Crew P/A">
          <template #body="planeProps">
            {{ planeProps.data.crew.pilots }} /
            {{ planeProps.data.crew.attendants }}
          </template>
        </Column>
        <Column
          field="specs.maxPassengers"
          header="Passengers"
          sortable
        ></Column>
        <Column field="specs.cargoCapacity" header="Cargo" sortable>
          <template #body="variantProps">
            ${{ variantProps.data.specs.cargoCapacity }}T
          </template>
        </Column>
      </DataTable>

      <Button
        :disabled="!planeSelection"
        label="Create Route"
        @click="
          viewPlanePicker = false;
          viewRouteCreator = true;
        "
      />
    </div>
    <div v-else-if="viewRouteCreator">
      <!-- Show list of airports. Two lists, ones you have terminals and ones you dont.
       Then on selection find valid ends. -->
      {{ airportList }}
    </div>
    <div v-else>
      <h2>Please purchase an airplane to create a route.</h2>
    </div>
  </Dialog>
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
