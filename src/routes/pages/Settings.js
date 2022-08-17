import { useState } from "react";
import { useDeliveryLocations } from "../../utils/providers/LocationProvider";
import { downloadObj } from "../../utils/hooks/useDeliveryLocations";

export default function Settings() {
  const [showAdd, setShowAdd] = useState(false);

  const { loadFileOnEvent, deliveryLocations, reset, add } =
    useDeliveryLocations();

  return (
    <div>
      <h1>Settings</h1>
      <label for="fileTag">
        Upload a file of locations.
        <input
          type="file"
          onChange={loadFileOnEvent}
          id="fileTag"
          label="locations"
          accept=".json"
        />
      </label>

      <div className="action-btns">
        <button onClick={reset}>Reset</button>
        <button>
          <a {...{ ...downloadObj(deliveryLocations) }}>Download</a>
        </button>
        <button onClick={() => setShowAdd((t) => !t)}>Add</button>
      </div>
      {showAdd && <AddLocation add={add} setShowAdd={setShowAdd} />}
    </div>
  );
}
const defaultState = {
  suburb: "Mitchelton",
  name: "",
  type: "",
  priority: 0,
};
const AddLocation = ({ add, setShowAdd }) => {
  const [state, setState] = useState(defaultState);

  const onChange = (key) => (e) =>
    setState((s) => ({ ...s, [key]: e.target.value }));

  const onClick = () => {
    if (state.name.length > 0) {
      add(state);
      setState(defaultState);
      setShowAdd((t) => !t);
    }
  };

  return (
    <form className="add-location">
      <select
        value={state.suburb}
        type="text"
        placeholder="Suburb..."
        onChange={onChange("suburb")}
      >
        <option value="Mitchelton">Mitchelton</option>
        <option value="Upper Kedron">Upper Kedron</option>
        <option value="Keperra">Keperra</option>
        <option value="Gaythorne">Gaythorne</option>
      </select>
      <input
        value={state.name}
        type="text"
        placeholder="Location Name..."
        onChange={onChange("name")}
      />
      <input
        value={state.type}
        type="text"
        placeholder="Street Type?"
        onChange={onChange("type")}
      />
      <input
        value={state.priority}
        type="text"
        placeholder="Priority?"
        onChange={onChange("priority")}
      />
      <input type="button" value="Add" onClick={onClick} />
    </form>
  );
};
