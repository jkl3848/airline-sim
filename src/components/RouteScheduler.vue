<script setup>
import { onMounted, watch } from "vue";
import { airlineStore } from "@stores/airlineStore.js";
import { windowManager } from "@stores/windowManager.js";
import { scheduleFlight, getFlightsForRoute } from "@modules/routeManager";
import { FilterMatchMode } from "@primevue/core/api";

const filters = $ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

let routeSelection = $ref();
let airplaneSelection = $ref();
let daysOfWeek = $ref([0]);
let departureTime = $ref("08:00");
let turnaroundMinutes = $ref(60);

const flightsForRoute = $computed(() => routeSelection ? getFlightsForRoute(routeSelection.id) : []);

function toggleDay(day){
  if (daysOfWeek.includes(day)) {
    daysOfWeek = daysOfWeek.filter(d => d !== day);
  } else {
    daysOfWeek.push(day);
  }
}

function createFlight(){
  if(!routeSelection || !airplaneSelection || daysOfWeek.length === 0) return;
  const [h,m] = departureTime.split(":").map(Number);
  const departureMinutes = h*60 + m;
  scheduleFlight({
    routeId: routeSelection.id,
    airplaneId: airplaneSelection.id,
    daysOfWeek,
    departureMinutes,
    turnaroundMinutes: Number(turnaroundMinutes)
  });
  daysOfWeek = [0];
  departureTime = "08:00";
  turnaroundMinutes = 60;
}

watch(() => windowManager.routeSchedulerPanelOpen, (open) => {
  if(open){
    routeSelection = null;
    airplaneSelection = null;
    daysOfWeek = [0];
    departureTime = "08:00";
  }
});

onMounted(() => {});
</script>

<template>
  <Dialog v-model:visible="windowManager.routeSchedulerPanelOpen" modal header="Schedule Flights">
    <div class="flex flex-col gap-6">
      <div>
        <h3 class="font-bold mb-2">Select Route</h3>
        <DataTable
          v-model:filters="filters"
          :value="airlineStore.userAirline.routes"
          v-model:selection="routeSelection"
          selection-mode="single"
          dataKey="id"
          tableStyle="min-width:50rem"
        >
          <Column field="start" header="Start" sortable />
          <Column field="end" header="End" sortable />
          <Column field="distance" header="Km" sortable />
          <Column field="baseDemand" header="Demand" sortable />
        </DataTable>
      </div>
      <div v-if="routeSelection">
        <h3 class="font-bold mb-2">Select Airplane</h3>
        <DataTable
          v-model:filters="filters"
          :value="airlineStore.userAirline.airplanes"
          v-model:selection="airplaneSelection"
          selection-mode="single"
          dataKey="id"
          tableStyle="min-width:50rem"
        >
          <Column field="builder" header="Builder" />
          <Column field="family" header="Family" />
          <Column field="variantName" header="Variant" />
        </DataTable>
      </div>
      <div v-if="airplaneSelection" class="flex flex-col gap-4">
        <h3 class="font-bold">Flight Pattern</h3>
        <div class="flex gap-2 items-center flex-wrap">
          <span v-for="day in 7" :key="day">
            <Button size="small" :severity="daysOfWeek.includes(day-1)?'success':'secondary'" @click="toggleDay(day-1)" :label="['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day-1]" />
          </span>
        </div>
        <div class="flex gap-4 items-center">
          <label>Departure:
            <input type="time" v-model="departureTime" class="border px-2 py-1" />
          </label>
          <label>Turnaround (min):
            <input type="number" v-model="turnaroundMinutes" min="30" step="5" class="border px-2 py-1 w-24" />
          </label>
          <Button :disabled="daysOfWeek.length===0" label="Add Flight" @click="createFlight" />
        </div>
      </div>
      <div v-if="routeSelection">
        <h4 class="font-semibold mt-4">Scheduled Flights for Route</h4>
        <ul class="list-disc ml-5">
          <li v-for="f in flightsForRoute" :key="f.id">{{ f.id.slice(0,8) }}: Plane {{ f.airplaneId?.slice(0,8) }} | Days {{ f.daysOfWeek.join(',') }} @ {{ Math.floor(f.departureMinutes/60).toString().padStart(2,'0') }}:{{ (f.departureMinutes%60).toString().padStart(2,'0') }}</li>
        </ul>
      </div>
      <div class="flex justify-end gap-4">
        <Button label="Close" @click="windowManager.routeSchedulerPanelOpen=false" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>