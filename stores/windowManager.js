import { reactive } from "vue";

export const windowManager = reactive({
  airplanePanelOpen: false,
  routePanelOpen: false,
  routeSchedulerPanelOpen: false,
  showRoutesOnMap: true,

  openPlanePanel() {
    this.closeAllPanels();
    this.airplanePanelOpen = true;
  },
  openRoutePanel() {
    this.closeAllPanels();
    this.routePanelOpen = true;
  },
  openSchedulerPanel() {
    this.closeAllPanels();
    this.routeSchedulerPanelOpen = true;
  },
  closeAllPanels() {
    this.airplanePanelOpen = false;
    this.routePanelOpen = false;
    this.routeSchedulerPanelOpen = false;
  },
});

export default windowManager;
