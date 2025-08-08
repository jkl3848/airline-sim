<script setup>
import { onMounted } from "vue";
import { airlineStore } from "@stores/airlineStore.js";
import { windowManager } from "@stores/windowManager.js";
import airportList from "@data/airport_list.jsonc";
import { FilterMatchMode } from "@primevue/core/api";
import { getAirportDistance, getRouteDemand } from "@modules/calculationUtils";
import { v4 as uuidv4 } from "uuid";

const filters = $ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

let startSelection = $ref();
let endSelection = $ref();

const canCreate = $computed(() => !!startSelection && !!endSelection && startSelection.code !== endSelection.code);

function createRoute() {
  if (!canCreate) return;
  const distance = getAirportDistance(startSelection.code, endSelection.code);
  const demand = getRouteDemand(startSelection.code, endSelection.code, distance);
  airlineStore.userAirline.routes.push({
    id: uuidv4(),
    start: startSelection.code,
    end: endSelection.code,
    distance,
    baseDemand: demand,
  });
  startSelection = null;
  endSelection = null;
}

// Add row class helpers
function startRowClass(data){
  return startSelection && data.code === startSelection.code ? 'selected-row' : '';
}
function endRowClass(data){
  return endSelection && data.code === endSelection.code ? 'selected-row' : '';
}

onMounted(() => {});
</script>

<template>
  <Dialog v-model:visible="windowManager.routePanelOpen" modal header="Create a Route">
    <div class="flex flex-col gap-6">
      <div>
        <h3 class="font-bold mb-2">Select Start Airport</h3>
        <DataTable
          v-model:filters="filters"
          :value="airportList"
          v-model:selection="startSelection"
          selection-mode="single"
          dataKey="code"
          scrollable
          scroll-height="200px"
          tableStyle="min-width: 40rem"
          :rowClass="startRowClass"
        >
          <Column field="code" header="Code" sortable />
          <Column field="name" header="Name" />
          <Column field="country" header="Country" />
        </DataTable>
      </div>
      <div v-if="startSelection">
        <h3 class="font-bold mb-2">Select End Airport</h3>
        <DataTable
          v-model:filters="filters"
            :value="airportList.filter(a => a.code !== startSelection.code)"
            v-model:selection="endSelection"
            selection-mode="single"
            dataKey="code"
            scrollable
            scroll-height="200px"
            tableStyle="min-width: 40rem"
            :rowClass="endRowClass"
        >
          <Column field="code" header="Code" sortable />
          <Column field="name" header="Name" />
          <Column field="country" header="Country" />
        </DataTable>
      </div>
      <div class="flex gap-4 justify-end">
        <Button label="Close" @click="windowManager.routePanelOpen=false" />
        <Button :disabled="!canCreate" label="Create Route" @click="createRoute" />
      </div>
      <div>
        <h4 class="font-semibold">Existing Routes</h4>
        <ul class="list-disc ml-5">
          <li v-for="r in airlineStore.userAirline.routes" :key="r.id">{{ r.start }} -> {{ r.end }} ({{ r.distance.toFixed(0) }} km)</li>
        </ul>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.selected-row :deep(td){
  background-color:#dbeafe !important; /* light blue */
  transition: background-color .15s ease;
}
</style>
