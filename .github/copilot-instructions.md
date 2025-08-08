# Copilot Instructions for airline-sim

This guide enables AI coding agents to be productive in the `airline-sim` codebase. It summarizes architecture, workflows, and conventions unique to this project.

## Architecture Overview

- **Frontend:** Vue 3 app (see `src/`), built with Vite.
- **Component Structure:**
  - UI split into panels (`BottomPanel.vue`, `PlanePanel.vue`, `RightPanel.vue`, `RoutePanel.vue`, `RouteScheduler.vue`, `WorldMap.vue`).
  - Custom UI library in `src/volt/` (e.g., `Button.vue`, `Drawer.vue`).
- **State Management:** Pinia stores in `src/stores/` (e.g., `airlineStore.js`, `economyStore.js`).
- **Game Logic:** Encapsulated in `src/modules/` (e.g., `gameControl.js`, `routeManager.js`).
- **Data:** Static JSON/JSONC files in `lib/data/` (airlines, airplanes, airports, schemas).

## Developer Workflows

- **Install dependencies:** `yarn`
- **Start dev server:** `yarn dev`
- **Build for production:** `yarn build`
- **No test suite detected** (as of August 2025).
- **Debugging:** Use browser devtools; inspect state via Pinia.

## Project-Specific Conventions

- **Data Loading:** Game data is loaded from `lib/data/` using custom logic in `src/modules/dataProcessing.js`.
- **UI Patterns:** Prefer custom components from `src/volt/` for consistency.
- **Styling:** Tailwind CSS in `src/styles/tailwind.css`.
- **Mapping:** Map styles and logic in `lib/mapping/mapStyles.js` and `WorldMap.vue`.
- **File Naming:**
  - Panels/components: `*Panel.vue`, `*Scheduler.vue`
  - Stores: `*Store.js`
  - Modules: `*Utils.js`, `*Manager.js`, `*Control.js`

## Integration Points

- **External Libraries:**
  - Vue 3, Vite, Pinia, Tailwind CSS
- **No backend/server code**; all data is local/static.

## Examples

- To add a new airplane, update `lib/data/airplane_list.jsonc` and schema in `airplane_schema.json`.
- To extend UI, create a new component in `src/components/` or `src/volt/` and register in `App.vue`.
- For new game logic, add a module in `src/modules/` and connect via relevant store.

---

For questions about unclear patterns or missing documentation, ask the user for clarification or examples from the codebase.
