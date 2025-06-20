const mapColors = {
  water: "#c0dae1",
  land: "#f6efe6",
  borders: "#2d2a1c",
  points: "#c5ad8d",
  lines: "",
};

const globeStyle = {
  version: 8,
  id: "journey",
  name: "Journey",
  center: [0, 0],
  zoom: 2,
  projection: {
    type: "vertical-perspective",
  },
  sources: {
    base: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
    countries: {
      type: "vector",
      url: "https://demotiles.maplibre.org/tiles/tiles.json",
    },
    user_routes: {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": mapColors.water,
      },
    },
    {
      id: "countries",
      source: "countries",
      "source-layer": "countries",
      type: "fill",
      paint: {
        "fill-color": mapColors.land,
        "fill-opacity": 1,
        "fill-antialias": true,
        "fill-translate": [1, 1],
        "fill-outline-color": mapColors.borders,
      },
      layout: {
        visibility: "visible",
      },
    },
    {
      id: "labels",
      type: "symbol",
      source: "base",
      "source-layer": "place",
      minzoom: 2,
      filter: ["match", ["get", "class"], ["country"], true, false],
      layout: {
        "text-field": [
          "case",
          ["has", "name:nonlatin"],
          ["concat", ["get", "name:latin"], "\n", ["get", "name:nonlatin"]],
          ["coalesce", ["get", "name_en"], ["get", "name"]],
        ],
        "text-font": ["Noto Sans Italic"],
        "text-letter-spacing": 0.1,
        "text-max-width": 9,
        "text-size": ["interpolate", ["linear"], ["zoom"], 8, 9, 12, 10],
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": "#333",
        "text-halo-blur": 1,
        "text-halo-color": "#fff",
        "text-halo-width": 1,
      },
    },

    {
      id: "user-routes",
      type: "line",
      source: "user_routes",
      paint: {
        "line-color": "#ff5500",
        "line-width": 2,
      },
    },
  ],
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
};

const defaultStyle = {
  version: 8,
  id: "journey",
  name: "Journey",
  center: [0, 0],
  zoom: 1.2,
  sources: {
    base: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
    countries: {
      type: "vector",
      url: "https://demotiles.maplibre.org/tiles/tiles.json",
    },
    user_routes: {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": mapColors.water,
      },
    },
    {
      id: "countries",
      source: "countries",
      "source-layer": "countries",
      type: "fill",
      paint: {
        "fill-color": mapColors.land,
        "fill-opacity": 1,
        "fill-antialias": true,
        "fill-translate": [1, 1],
        "fill-outline-color": mapColors.borders,
      },
      layout: {
        visibility: "visible",
      },
    },
    {
      id: "labels",
      type: "symbol",
      source: "base",
      "source-layer": "place",
      minzoom: 2,
      filter: ["match", ["get", "class"], ["country"], true, false],
      layout: {
        "text-field": [
          "case",
          ["has", "name:nonlatin"],
          ["concat", ["get", "name:latin"], "\n", ["get", "name:nonlatin"]],
          ["coalesce", ["get", "name_en"], ["get", "name"]],
        ],
        "text-font": ["Noto Sans Italic"],
        "text-letter-spacing": 0.1,
        "text-max-width": 9,
        "text-size": ["interpolate", ["linear"], ["zoom"], 8, 9, 12, 10],
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": "#333",
        "text-halo-blur": 1,
        "text-halo-color": "#fff",
        "text-halo-width": 1,
      },
    },
    {
      id: "user-routes",
      type: "line",
      source: "user_routes",
      paint: {
        "line-color": "#ff5500",
        "line-width": 2,
      },
    },
  ],
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
};

export { globeStyle, defaultStyle, mapColors };
