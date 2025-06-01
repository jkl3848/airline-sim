import { reactive } from "vue";

export const windowManager = reactive({
  airplanePanelOpen: false,
  routePanelOpen: false,

  openPlanePanel(){
    this.closeAllPanels()
    this.airplanePanelOpen = true
  },
  openRoutePanel(){
    this.closeAllPanels()
    this.routePanelOpen = true
  },
  closeAllPanels(){
    this.airplanePanelOpen = false;
    this.routePanelOpen = false
  }
});

export default windowManager;
