import { useState } from "react";
import { useNewParcel } from "../../utils/hooks/useNewParcel";
import { Street } from "../ListView/DisplayStreets";
import { colors, nonColor } from "./constants";
import left from "../../assets/img/left.png";
import "./NewParcel.css";
import { hammingDistance } from "../../utils";
import { useDeliveryLocationsContext } from "../../utils/providers/LocationProvider";

export default function NewParcel() {
  const np = useNewParcel();
  const { newStreet, complete, previous, exit } = np;

  const step = (() => {
    switch (np.formState) {
      case 0:
        return <StreetNumberStep onClick={np.onClickLocation("number")} />;
      case 1:
        return <StreetNameStep next={np.next} setValue={np.setValue} />;
      case 2:
        return (
          <ParcelStep
            title="Box Type"
            list={["Bag", "Box"]}
            onClick={np.onClickParcel("type")}
          />
        );
      case 3:
        return (
          <ParcelStep
            title="Box Size"
            list={["L", "M", "S"]}
            onClick={np.onClickParcel("size")}
          />
        );
      case 4:
        return (
          <ParcelStep
            title="Box Colour"
            list={colors}
            onClick={np.onClickParcel("color")}
          />
        );
      case 5:
        return (
          <FinalStep
            notes={np.newStreet.notes}
            nextParcel={np.nextParcel}
            setValue={np.setValue}
            complete={np.complete}
          />
        );
      default:
        return <>404 Error: Return to Home</>;
    }
  })();

  return (
    <div className="new-parcel">
      <StreetHeader {...{ previous, newStreet, toggle: complete("/"), exit }} />
      <div className="content">{step}</div>
    </div>
  );
}

const StreetHeader = ({ previous, newStreet, toggle, exit }) => (
  <div className="header">
    <button className="back" onClick={previous}>
      <img src={left} alt="left" width={20} />
    </button>
    <Street
      street={{
        ...newStreet,
        ...newStreet.name,
        address: newStreet.name,
      }}
      toggle={toggle}
      remove={exit}
      toDisplay
    />
  </div>
);

const StreetNumberStep = ({ onClick }) => {
  const [number, setNumber] = useState("");
  const onChange = (e) => {
    e.preventDefault();
    setNumber(e.target.value);
  };
  return (
    <SingleInputForm
      onSubmit={onClick(number)}
      title="street number"
      input={{ onChange, value: number, inputMode: "numeric" }}
    />
  );
};

const StreetNameStep = ({ next, setValue }) => {
  const { deliveryLocations } = useDeliveryLocationsContext();
  const [name, setName] = useState("");

  const onChange = (e) => setName(e.target.value);

  const toDistance = (e) => ({
    ...e,
    d: hammingDistance(e.name.slice(0, name.length), name),
  });

  const l = deliveryLocations
    .map(toDistance)
    .sort((a, b) => a.d - b.d)
    .slice(0, 5);

  const onNext = (value) => (event) =>
    [event.preventDefault(), next(), setValue("name")(value), setName("")];

  const streets = l.map((location, i) => (
    <NameButton
      key={`${i}-st`}
      onClick={onNext(location)}
      location={location}
    />
  ));

  return (
    <SingleInputForm
      onSubmit={onNext(l[0])}
      title="street name"
      input={{ onChange, value: name, inputMode: "text" }}
    >
      {streets}
    </SingleInputForm>
  );
};

const SuburbCaption = ({ suburb }) => (
  <span className="suburb-caption">{suburb}</span>
);

const NameCaption = ({ name, type }) => (
  <span className="name-caption">
    <strong>{name} </strong> {type}
  </span>
);

const NameButton = ({ location, onClick }) => (
  <button className="btn location-option" onClick={onClick}>
    <div>
      <SuburbCaption suburb={location.suburb} />
      <NameCaption name={location.name} type={location.type} />
      <RightArrow />
    </div>
  </button>
);

const RightArrow = () => (
  <img
    src={left}
    alt="right"
    height={15}
    style={{ transform: "rotate(180deg)" }}
  />
);

const ParcelStep = ({ list, title, onClick }) => {
  const width = 600 / (Math.ceil(list.length / 6) * 6);

  const height = (list.length < 6 ? 70 : 140) / list.length + "vh";

  const getText = (e) => (e.name ? e.name.toUpperCase() : e.toUpperCase());

  const style = (item) => ({
    height,
    width: width + "%",
    background: nonColor[getText(item)]
      ? nonColor[getText(item)]
      : getText(item).toLowerCase(),
  });

  return (
    <BasicForm title={title}>
      {list.map((item, i) => (
        <Button
          key={getText(item) + i}
          onClick={onClick(item)}
          style={style(item)}
          text={getText(item)}
        />
      ))}
    </BasicForm>
  );
};

const Button = ({ onClick, style, text }) => (
  <button className="btn" style={style} onClick={onClick}>
    <span>{text}</span>
  </button>
);

const FinalStep = ({ setValue, complete, nextParcel, notes }) => {
  const onChange = (e) => setValue("notes")(e.target.value);

  return (
    <SingleInputForm
      onSubmit={complete("/")}
      title="add notes"
      input={{ onChange, value: notes, inputMode: "text" }}
    >
      <Navigation
        buttons={[
          { onClick: nextParcel, text: "ADD PARCEL", color: "gray" },
          { onClick: complete(0 + ""), text: "NEXT ADDRESS", color: "blue" },
        ]}
      />
      <Navigation
        buttons={[{ onClick: complete("/"), text: "COMPLETE", color: "green" }]}
      />
    </SingleInputForm>
  );
};

const Navigation = ({ buttons }) => (
  <div className="navigation">
    {buttons.map((button) => (
      <Button
        onClick={button.onClick}
        text={button.text}
        style={{ background: button.color }}
      />
    ))}
  </div>
);

const Caption = ({ title }) => (
  <div className="caption">
    <h2>{title.toUpperCase()}</h2>
  </div>
);

const BigInput = ({ value, onChange, inputMode = "text" }) => (
  <input
    className="big-input"
    value={value}
    onChange={onChange}
    autoFocus
    inputMode={inputMode}
  />
);

const SingleInputForm = ({ title, children, onSubmit, input }) => {
  console.log(input);
  return (
    <BasicForm title={title} onSubmit={onSubmit}>
      <BigInput
        onChange={input.onChange}
        value={input.value}
        inputMode={input.inputMode}
      />
      {children}
    </BasicForm>
  );
};

const BasicForm = ({ children, title, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <Caption title={title} />
    {children}
  </form>
);
