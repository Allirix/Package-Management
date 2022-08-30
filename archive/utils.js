const a = {
  mode: "drive",
  agents: [
    {
      start_location: [13.381453755359324, 52.520666399999996],
      time_windows: [[0, 7200]],
    },
  ],
  shipments: [
    {
      id: "order_1",
      pickup: {
        location_index: 0,
        duration: 120,
      },
      delivery: {
        location: [13.381175446198714, 52.50929975],
        duration: 120,
      },
    },
  ],
  locations: [
    {
      id: "warehouse-0",
      location: [13.3465209, 52.5245064],
    },
  ],
};

const { display } = useStreetContext();

const [start, setStart] = useState({});
const [end, setEnd] = useState({});

const [state, setState] = useState({ features: [[]] });

const streets = Object.keys(display)
  .filter((e) => e !== "Delivered")
  .flatMap((suburb) => display[suburb]);

const waypoints = streets.map(({ lat, lng }) => lat + "," + lng).join("|");

const onClick = (evt) => {
  const a = prompt("Are you sure? Type Yes if you are", "No");

  if (a !== "Yes") return;

  const baseURL = "https://api.geoapify.com/v1/routing";
  const params = {
    waypoints,
    mode: "drive_traffic_approximated",
    apiKey: "f0b74fcf525e46ee813d1a3104be4c2a",
    type: "short",
    traffic: "approximated",
  };
  const URL = `${baseURL}?${new URLSearchParams(params)}`;

  (async () => {
    // const response = await fetch(URL);
    // const data = await response.json();

    const data = testData;
    setState(data);
  })();
};
