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
let departureTime = $ref("08:00"); // used as input for adding times
let timesList = $ref(["08:00"]);
let turnaroundMinutes = $ref(60);
let scheduleError = $ref("");

const flightsForRoute = $computed(() => routeSelection ? getFlightsForRoute(routeSelection.id) : []);
const computedFlightMinutes = $computed(() => {
  if(!routeSelection || !airplaneSelection) return 0;
  const variant = { specs: airplaneSelection.specs || {} };
  const cruiseSpeed = variant.specs.cruiseSpeed || 800; // km/h
  return Math.round((routeSelection.distance / cruiseSpeed) * 60);
});
const availabilityResult = $computed(() => {
  if(!airplaneSelection) return null;
  const [h,m] = departureTime.split(":").map(Number);
  const dep = h*60 + m;
  const end = dep + computedFlightMinutes + Number(turnaroundMinutes);
  return airlineStore.isAirplaneAvailable(airplaneSelection.id, daysOfWeek, dep, end);
});

function toggleDay(day){
  if (daysOfWeek.includes(day)) {
    daysOfWeek = daysOfWeek.filter(d => d !== day);
  } else {
    daysOfWeek.push(day);
  }
}

function addTime(){
  if(!/^[0-2]?[0-9]:[0-5][0-9]$/.test(departureTime)) return;
  // normalize HH:MM
  let [h,m] = departureTime.split(":").map(n=>Number(n));
  if(h>23) h = 23; // clamp
  const norm = h.toString().padStart(2,'0')+":"+m.toString().padStart(2,'0');
  if(!timesList.includes(norm)){
    timesList.push(norm);
    timesList.sort();
  }
  departureTime = norm; // keep last entered
}
function removeTime(t){
  timesList = timesList.filter(x => x!==t);
  if(timesList.length===0){
    timesList.push("08:00");
  }
}

const timesAvailability = $computed(() => {
  if(!airplaneSelection || !routeSelection) return [];
  const results = [];
  const flightLen = computedFlightMinutes + Number(turnaroundMinutes);
  // precompute proposed blocks
  const proposed = timesList.map(time => {
    const [h,m] = time.split(":").map(Number);
    const start = h*60 + m;
    const end = start + flightLen;
    return { time, start, end };
  });
  proposed.forEach(p => {
    // conflicts within batch (other proposed times overlapping)
    const intra = proposed.filter(o => o.time!==p.time && !(p.end <= o.start || p.start >= o.end)).map(o => o.time);
    // conflicts with existing schedule
    let existingConflicts = [];
    if(intra.length === 0){
      // only check existing if no intra conflict; still check to list conflicts though
      const avail = airlineStore.isAirplaneAvailable(airplaneSelection.id, daysOfWeek, p.start, p.end);
      if(!avail.ok){
        existingConflicts = avail.conflicts.map(c => c.day+":"+c.flightId.slice(0,6));
      }
    } else {
      // still compute existing for info
      const avail = airlineStore.isAirplaneAvailable(airplaneSelection.id, daysOfWeek, p.start, p.end);
      if(!avail.ok){
        existingConflicts = avail.conflicts.map(c => c.day+":"+c.flightId.slice(0,6));
      }
    }
    results.push({
      time: p.time,
      ok: intra.length===0 && existingConflicts.length===0,
      intraConflicts: intra,
      existingConflicts,
    });
  });
  return results;
});

function scheduleBatch(){
  scheduleError = "";
  if(!routeSelection || !airplaneSelection || daysOfWeek.length===0) return;
  const flightLen = computedFlightMinutes + Number(turnaroundMinutes);
  // Only attempt those marked ok
  const okTimes = timesAvailability.filter(t => t.ok).map(t => t.time);
  const successes = [];
  const failures = [];
  okTimes.sort();
  for(const time of okTimes){
    const [h,m] = time.split(":").map(Number);
    const departureMinutes = h*60 + m;
    try {
      scheduleFlight({
        routeId: routeSelection.id,
        airplaneId: airplaneSelection.id,
        daysOfWeek,
        departureMinutes,
        turnaroundMinutes: Number(turnaroundMinutes)
      });
      successes.push(time);
    } catch(e){
      failures.push({ time, reason: e.message });
    }
  }
  if(failures.length){
    scheduleError = `Some times failed: ${failures.map(f=>f.time).join(', ')}`;
  }
  if(successes.length){
    // reset proposed times list keeping last entered as starting point
    timesList = [successes[0]];
  }
}

// Adjust existing createFlight usage references
function createFlight(){
  scheduleError = "";
  if(!routeSelection || !airplaneSelection || daysOfWeek.length === 0) return;
  const [h,m] = departureTime.split(":").map(Number);
  const departureMinutes = h*60 + m;
  try {
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
  } catch(e){
    scheduleError = e.message;
  }
}

function routeRowClass(data){
  return routeSelection && data.id === routeSelection.id ? 'selected-row' : '';
}
function airplaneRowClass(data){
  return airplaneSelection && data.id === airplaneSelection.id ? 'selected-row' : '';
}
function flightRowClass(f){
  return '';
}

watch(() => windowManager.routeSchedulerPanelOpen, (open) => {
  if(open){
    routeSelection = null;
    airplaneSelection = null;
    daysOfWeek = [0];
    departureTime = "08:00";
    turnaroundMinutes = 60;
    scheduleError = "";
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
          :rowClass="routeRowClass"
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
          :rowClass="airplaneRowClass"
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
            <Button size="small" :severity="daysOfWeek.includes(day-1)?'info':'secondary'" @click="toggleDay(day-1)" :label="['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day-1]" />
          </span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex gap-4 items-end flex-wrap">
            <label class="flex flex-col text-sm">New Time
              <input type="time" v-model="departureTime" class="border px-2 py-1" />
            </label>
            <label class="flex flex-col text-sm">Turnaround (min)
              <input type="number" v-model="turnaroundMinutes" min="30" step="5" class="border px-2 py-1 w-28" />
            </label>
            <div class="text-sm pt-2" v-if="routeSelection">
              Block: {{ computedFlightMinutes }}m | Occupied: {{ computedFlightMinutes + Number(turnaroundMinutes) }}m
            </div>
            <Button size="small" label="Add Time" @click="addTime" />
            <Button size="small" :disabled="timesAvailability.some(t=>!t.ok) || daysOfWeek.length===0" label="Schedule Flights" @click="scheduleBatch" />
          </div>
          <div class="flex gap-2 flex-wrap items-center">
            <div v-for="t in timesAvailability" :key="t.time" class="time-chip" :class="{ conflict: !t.ok }">
              <span>{{ t.time }}</span>
              <span v-if="!t.ok" class="ml-1 text-xs">⚠</span>
              <Button text size="small" label="x" @click="removeTime(t.time)" />
              <div v-if="!t.ok" class="conflict-detail text-xs mt-1">
                <span v-if="t.intraConflicts.length">Overlap: {{ t.intraConflicts.join(',') }}</span>
                <span v-if="t.existingConflicts.length"> Existing: {{ t.existingConflicts.join(' ') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="scheduleError" class="text-red-600 text-sm">{{ scheduleError }}</div>
      </div>
      <div v-if="routeSelection">
        <h4 class="font-semibold mt-4">Scheduled Flights for Route</h4>
        <ul class="list-disc ml-5">
          <li v-for="f in flightsForRoute" :key="f.id" :class="{'conflict-flight': availabilityResult && !availabilityResult.ok && availabilityResult.conflicts.some(c => c.flightId === f.id)}">{{ f.id.slice(0,8) }}: Plane {{ f.airplaneId?.slice(0,8) }} | Days {{ f.daysOfWeek.join(',') }} @ {{ Math.floor(f.departureMinutes/60).toString().padStart(2,'0') }}:{{ (f.departureMinutes%60).toString().padStart(2,'0') }} | {{ f.flightTimeMinutes }}m</li>
        </ul>
      </div>
      <div class="flex justify-end gap-4">
        <Button label="Close" @click="windowManager.routeSchedulerPanelOpen=false" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.selected-row :deep(td){
  background-color:#dbeafe !important;
}
.conflict-flight{
  color:#b91c1c; /* red */
  font-weight:600;
}
.time-chip{ padding:0.25rem 0.5rem; border-radius:0.375rem; background:#d1fae5; color:#065f46; display:flex; flex-direction:column; position:relative; }
.time-chip.conflict{ background:#fee2e2; color:#991b1b; }
.time-chip button{ margin-left:0.25rem; }
.conflict-detail{ color:#b91c1c; }
</style>