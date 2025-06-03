<script setup>
import { airlineStore } from "@stores/airlineStore.js";
import airplaneList from "@data/airplane_list.jsonc";
import { v4 as uuidv4 } from "uuid";
import { windowManager } from "@stores/windowManager.js";

import { FilterMatchMode } from "@primevue/core/api";

let purchaseList = $ref([]);
let purchaseTotal = $ref(0);
let selectedProducts = $ref();

let expandedRows = $ref({});
let subExpansion = $ref({});
const filters = $ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function purchaseAirplanes() {
  airlineStore.userAirline.money -= purchaseTotal;

  for (let i = 0; i < purchaseList.length; i++) {
    const planeObj = purchaseList;
    planeObj.id = uuidv4();

    airlineStore.userAirline.airplanes =
      airlineStore.userAirline.airplanes.concat(planeObj);
  }
  purchaseTotal = 0;
  purchaseList = [];
}

function togglePlaneInOrder(planeVal, varVal, state) {
  console.log(planeVal);
  console.log(varVal);
  console.log(state);
  if (state) {
    const { variants, ...restOfPlane } = planeVal;
    const newPlane = {
      ...restOfPlane,
      ...varVal,
      routes: [],
    };

    purchaseList.push(newPlane);
    purchaseTotal += varVal.cost;
  } else {
    purchaseList = purchaseList.filter(
      (obj) =>
        !(
          obj.planeID === planeVal.planeID && obj.variantID === varVal.variantID
        )
    );

    purchaseTotal -= varVal.cost;
  }
}

function expandAll() {
  expandedRows = airplaneList.reduce(
    (acc, p) => (acc[p.planeID] = true) && acc,
    {}
  );
}

function collapseAll() {
  expandedRows = null;
}
</script>

<template>
  <Dialog
    v-model:visible="windowManager.airplanePanelOpen"
    modal
    header="Buy an airplane!"
    pt:root="w-[80vw] h-[80vh] max-w-[80vw] max-h-[80vh]"
  >
    <div>
      <DataTable
        v-model:filters="filters"
        v-model:expandedRows="expandedRows"
        :value="airplaneList"
        dataKey="planeID"
        @rowExpand="onRowExpand"
        @rowCollapse="onRowCollapse"
        tableStyle="min-width: 60rem"
      >
        <template #header>
          <div class="flex flex-wrap justify-end gap-2">
            <Button
              text
              icon="pi pi-plus"
              label="Expand All"
              @click="expandAll"
            />
            <Button
              text
              icon="pi pi-minus"
              label="Collapse All"
              @click="collapseAll"
            />
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
        <Column expander style="width: 5rem" />
        <Column field="builder" header="Builder" sortable></Column>
        <Column field="family" header="Family"></Column>
        <Column field="variants.length" header="Variants"></Column>
        <Column field="size" header="Size" sortable></Column>

        <template #expansion="slotProps">
          <div class="p-4">
            <DataTable
              :value="slotProps.data.variants"
              dataKey="variantID"
              v-model:expandedRows="subExpansion"
            >
              <Column expander style="width: 5rem" />
              <Column field="variantName" header="Variant" sortable></Column>
              <Column field="cost" header="Cost" sortable>
                <template #body="variantProps">
                  ${{ variantProps.data.cost.toLocaleString() }}
                </template>
              </Column>
              <Column field="crew" header="Crew P/A">
                <template #body="variantProps">
                  {{ variantProps.data.crew.pilots }} /
                  {{ variantProps.data.crew.attendants }}
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

              <Column header="Purchase">
                <template #body="variantProps">
                  <Button
                    label="+"
                    @click="
                      togglePlaneInOrder(
                        slotProps.data,
                        variantProps.data,
                        true
                      )
                    "
                  />
                  <Button
                    label="-"
                    @click="
                      togglePlaneInOrder(
                        slotProps.data,
                        variantProps.data,
                        false
                      )
                    "
                  /> </template
              ></Column>

              <template #expansion="detailProps">
                <div>
                  Range: {{ detailProps.data.specs.maxRange }} Speed:
                  {{ detailProps.data.specs.maxSpeed }}
                </div>
              </template>
            </DataTable>
          </div>
        </template>
      </DataTable>

      <div>
        <div>Order:</div>
        <table>
          <thead class="bg-gray-100 sticky top-0">
            <tr>
              <th class="border px-2 py-1">Plane</th>
              <th class="border px-2 py-1">Cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plane in purchaseList">
              <td class="border px-2 py-1">
                {{ plane.builder }} {{ plane.variantName }}
              </td>
              <td class="border px-2 py-1">
                ${{ plane.cost.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>Total: ${{ purchaseTotal.toLocaleString() }}</div>
      <Button @click="purchaseAirplanes()" label="Purchase" />
    </div>
  </Dialog>
</template>

<style scoped></style>
