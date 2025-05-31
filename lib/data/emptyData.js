const airplane = [
  {
    "builder": "Airscape",
    "family": "2100",
    "recalls": [],
    "size": "medium",
    "variants": [
      {
        "variantName": "2110",
        "dateSaleBegin": 0,
        "dateSaleEnd": 0,
        "cost": 100000000,
        "salesStats": {
          "quantityBuilt": 0,
          "quantitySold": 0,
          "operators": [{ "airlineName": 0, "quantity": 0 }]
        },
        "crew": {
          "pilots": 2,
          "attendants": 3
        },
        "specs": {
          "length": 340,
          "wingspan": 360,
          "maxPayload": 13200,
          "fuelCapacity": 23760,
          "maxRange": 7750,
          "rangeAtMaxPayload": 6900,
          "maxSpeed": 890,
          "cruiseSpeed": 830,
          "maxAltitude": 12000,
          "maxPassengers": 156
        },
        "isCargo": false,
        "seatLayouts": [
          {
            "firstClass": 0,
            "businessClass": 0,
            "comfort": 0,
            "economyPlus": 0,
            "economy": 156
          },
          {
            "firstClass": 16,
            "businessClass": 0,
            "comfort": 0,
            "economyPlus": 30,
            "economy": 96
          }
        ]
      }
    ]
  }
]

const airline = [
  {
    builder: "",
    name: "",
    family: "",
    dateSaleBegin: 0,
    dateSaleEnd: 0,
    recalls: [],
    specs: {
      length: 0,
      width: 0,
      height: 0,
      wingspan: 0,
      maxPayload: 0,
      fuelCapacity: 0,
      maxRange: 0,
      rangeAtMaxPayload: 0,
      maxSpeed: 0,
      cruiseSpeed: 0,
      maxAltitude: 0,
      maxPassengers: 0,
    },
    cost: 0,
    salesStats: {
      quantityBuilt: 0,
      quantitySold: 0,
      operators: [{ airlineName: 0, quantity: 0 }],
    },
    variants: {
      variantName: "",
      specOverrides: {},
      isCargo: false,
    },
    seatLayouts: [
      {
        firstClass: 0,
        businessClass: 0,
        comfort: 0,
        economyPlus: 0,
        economy: 0,
      },
    ],
  },
];

const airport = [
    {
    "code": "MCO",
    "icao": "KMCO",
    "name": "Orlando International Airport",
    "latitude": 28.412903550000003,
    "longitude": -81.30944309752753,
    "time_zone": "America/New_York",
    "city_code": "ORL",
    "country": "US",
    "city": "Taft",
    "state": "Florida",
    "isInternational": true,
    "size": "large",
    "passengers": 0
  }
]