import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";

import "./styles/tailwind.css"

import Accordion from "./volt/Accordion.vue";
import AccordionContent from "./volt/AccordionContent.vue";
import AccordionHeader from "./volt/AccordionHeader.vue";
import AccordionPanel from "./volt/AccordionPanel.vue";
import Button from "./volt/Button.vue";
import DataTable from "./volt/DataTable.vue";
import Dialog from "./volt/Dialog.vue";
import Divider from "./volt/Divider.vue";
import Drawer from "./volt/Drawer.vue";
import InputText from "./volt/InputText.vue";


const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    unstyled: true
  },
});

app.component('Accordion', Accordion)
app.component('AccordionContent', AccordionContent)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionPanel', AccordionPanel)
app.component('Button', Button)
app.component('DataTable', DataTable)
app.component('Dialog', Dialog)
app.component('Divider', Divider)
app.component('Drawer', Drawer)
app.component('InputText', InputText)


app.mount("#app");
