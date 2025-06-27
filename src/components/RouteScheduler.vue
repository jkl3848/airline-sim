<script setup>
import { onMounted, watch } from "vue";
import { airlineStore } from "@stores/airlineStore.js";
import { windowManager } from "@stores/windowManager.js";
import { getRouteByID } from "@modules/routeManager";

import { FilterMatchMode } from "@primevue/core/api";

const filters = $ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const userRoutes = $computed(() => {
return getRouteByID(airlineStore.userAirline.routes.flatMap(item => item.routeID))
})

let viewRoutePicker = $ref(false);
let viewScheduler = $ref(false);

let routeSelection = $ref()

onMounted(() => {
  viewRoutePicker = true;
});

watch(
  () => windowManager.routeSchedulerPanelOpen,
  (newVal) => {
    if(newVal) {
      viewRoutePicker = true;
      viewScheduler = false;
      routeSelection = null;

      if(airlineStore.userAirline?.routes?.length === 0){
        windowManager.openRoutePanel()
      }
    }
  }
);

</script>

<template>
  <Dialog
    v-model:visible="windowManager.routeSchedulerPanelOpen"
    modal
    header="Schedule a Flight!"
  >
    <div v-if="viewRoutePicker">
        <DataTable
            v-model:filters="filters"
            :value="userRoutes"
            v-model:selection="routeSelection"
            selection-mode="single"
            dataKey="routeID"
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
            <Column field="startingAirport" header="Start" sortable></Column>
            <Column field="endingAirport" header="End" sortable></Column>
            <Column field="distance" header="Distance" sortable></Column>
            <Column field="baseDemand" header="Demand" sortable></Column>
        </DataTable>

        <Button
            :disabled="!routeSelection"
            label="Select Route"
            @click="
            viewRoutePicker = false;
            viewScheduler = true;
            "
        />
    </div>
    <div v-else-if="viewScheduler">

    </div>

    </Dialog>

</template>

<style scoped>

</style>