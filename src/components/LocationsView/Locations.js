import { useMemo, useState } from "react";
import "./Locations.css";
import { useLocationsContext } from "../../utils/providers/LocationProvider";

const suburbNames = ["Mitchelton", "Upper Kedron", "Gaythorne", "Keperra"];

export default function LocationsView() {
  const [selectedSuburb, setSelectedSuburb] = useState(suburbNames[0]);
  const { locations, remove, edit, add } = useLocationsContext();

  const suburbs = useMemo(
    () =>
      locations.reduce((acc, l, id) => {
        console.log(acc);

        const poi = {
          ...l,
          id,
          remove: remove(id),
          edit: edit(id),
        };
        if (l.suburb in acc) acc[l.suburb] = acc[l.suburb].concat(poi);
        else acc[l.suburb] = [poi];
        return acc;
      }, {}),
    [locations]
  );
  console.log(suburbs, locations);
  return (
    <>
      <div className="suburb-select">
        {suburbNames.map((name, i) => (
          <button
            key={i + "suburb-option"}
            onClick={() => setSelectedSuburb(name)}
            disabled={selectedSuburb === name}
            style={
              selectedSuburb === name ? { borderBottom: "2px solid blue" } : {}
            }
          >
            {name}
          </button>
        ))}
      </div>

      <AddLocation add={add} selectedSuburb={selectedSuburb} />

      {suburbs[selectedSuburb]
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => a.priority - b.priority)
        .map((location) => (
          <Location
            key={location.id + "location"}
            {...{ location, remove, edit }}
          />
        ))}
    </>
  );
}

const Location = ({ location }) => {
  const { remove, edit } = location;
  const onEdit = (key) => (e) => edit(key, e.target.value);
  const onRemove = () => remove();

  return (
    <div className="location">
      {/* <input
        className="l-priority"
        value={location.priority}
        onChange={onEdit("priority")}
      /> */}
      <input
        className="l-names"
        value={location.name}
        onChange={onEdit("name")}
      />
      <input
        className="l-type"
        value={location.type}
        onChange={onEdit("type")}
      />
      <button className="l-remove" onClick={onRemove}>
        <img src="/img/remove.png" alt="" />
      </button>
    </div>
  );
};
const defaultState = {
  suburb: "Mitchelton",
  name: "",
  type: "",
  priority: "",
  full: "",
};
const AddLocation = ({ add, selectedSuburb }) => {
  const [state, setState] = useState(defaultState);

  const onChange = (key) => (e) =>
    setState((s) => ({ ...s, [key]: e.target.value }));
  // const onChange = (key) => (e) => edit(key, e.target.value, i);
  const onClick = () => {
    if (state.name.length > 0) {
      add(selectedSuburb, state);
      setState(defaultState);
    }
  };

  return (
    <div className="location">
      {/* <input
        className="l-priority"
        value={state.priority}
        type="text"
        placeholder="n"
        onChange={onChange("priority")}
      /> */}
      <input
        className="l-names"
        value={state.name}
        type="text"
        placeholder={`Add ${selectedSuburb} location...`}
        onChange={onChange("name")}
      />
      <input
        className="l-type"
        value={state.type}
        type="text"
        placeholder="Type?"
        onChange={onChange("type")}
      />
      <button
        className="l-remove"
        onClick={onClick}
        style={{ background: "rgb(49, 49, 156)" }}
      >
        <img src="/img/plus.png" alt="" />
      </button>
    </div>
  );
};
