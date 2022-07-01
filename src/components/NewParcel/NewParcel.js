import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNewParcel } from "../../utils/hooks/useNewParcel";
import { Street } from "../ListView/DisplayStreets";
import { colors, nonColor } from "./constants";
import left from "../../assets/img/left.png";
import "./NewParcel.css";
import { hammingDistance } from "../../utils";

const RightArrow = () => (
  <img
    src={left}
    alt="right"
    height={15}
    style={{ transform: "rotate(180deg)" }}
  />
);

export default function NewParcel() {
  const { formState } = useParams();
  const navigate = useNavigate();
  const { setValue, setParcelValue, newStreet, lists, add, reset } =
    useNewParcel();

  const next = () => navigate(`${Number(formState) + 1}`);

  const complete =
    (to = "/") =>
    () => {
      if (newStreet.parcels.length < 1 || !newStreet.name || !newStreet.suburb)
        return alert("Location not added. Missing name/suburb/parcels");
      add({
        ...newStreet,
        ...newStreet.name,
        address: newStreet.name,
        parcels: newStreet.parcels,
      });
      reset();
      navigate(to);
    };

  const step = (() => {
    switch (Number(formState)) {
      case 0:
        return (
          <StreetNumberStep
            onClick={(e) => () => [setValue("number")(e), next()]}
          />
        );
      case 1:
        return <StreetNameStep {...{ ...lists, next, setValue }} />;
      case 2:
        return (
          <Step
            title="Box Type"
            list={["Bag", "Box"]}
            onClick={(e) => () => [setParcelValue("type")(e), next()]}
          />
        );
      case 3:
        return (
          <Step
            title="Box Size"
            list={["L", "M", "S"]}
            onClick={(e) => () => [setParcelValue("size")(e), next()]}
          />
        );
      case 4:
        return (
          <Step
            title="Box Type"
            list={colors}
            onClick={(e) => () => [setParcelValue("color")(e), next()]}
          />
        );
      case 5:
        return (
          <FinalStep
            {...{
              s: newStreet,
              add,
              navigate,
              setValue,
              complete,
            }}
          />
        );
      default:
        return <>Error</>;
    }
  })();

  const Previous = () => (
    <button className="previous" onClick={() => navigate(-1)}>
      <img src={left} alt="left" width={20} />
    </button>
  );

  const Preview = () => (
    <Street
      street={{
        ...newStreet,
        ...newStreet.name,
        address: newStreet.name,
        parcels: newStreet.parcels,
        deliverNumber: null,
      }}
      toggle={complete("/")}
      remove={() => [navigate("/"), reset()]}
      toDisplay
    />
  );

  return (
    <div className="new-parcel">
      <div className="street-header">
        <Previous />
        <Preview />
      </div>
      <div className="street-content">{step}</div>
    </div>
  );
}

const StreetNumberStep = ({ onClick }) => {
  const [number, setNumber] = useState("");
  const onChange = (e) => {
    e.preventDefault();
    setNumber(e.target.value);
  };
  return (
    <div className="selected-generic">
      <Caption title="street number" />
      <form onSubmit={onClick(number)}>
        <input
          type="text"
          inputMode="numeric"
          value={number}
          onChange={onChange}
          className="street-number-input"
          autoFocus
        />
      </form>
    </div>
  );
};

const StreetNameStep = ({ locations, next, setValue }) => {
  const [name, setName] = useState("");

  const onChange = (e) => setName(e.target.value);

  const toDistance = (e) => ({
    ...e,
    d: hammingDistance(e.name.slice(0, name.length), name),
  });

  const byDistance = (a, b) => a.d - b.d;

  const l = locations.map(toDistance).sort(byDistance).slice(0, 5);

  const onSubmit = (e) => [e.preventDefult(), setValue("name")(l[0]), next()];

  const onClick = (e) => (ev) =>
    [ev.preventDefault(), next(), setValue("name")(e), setName("")];

  return (
    <form onSubmit={onSubmit}>
      <Caption title="street name" />
      <input
        className="street-name-input"
        value={name}
        onChange={onChange}
        autoFocus
      />
      <div className="street-name-btns">
        {name &&
          l.map((location, i) => (
            <NameButton
              key={`${i}-st`}
              onClick={onClick(location)}
              location={location}
            />
          ))}
      </div>
    </form>
  );
};

const Step = (props) => {
  const { onClick, list, title = "Test", children } = props;
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
    <div className="selected-generic">
      <Caption title={title} />
      {children}
      <div className="buttons">
        {list.map((item, i) => (
          <Button
            key={getText(item) + i}
            onClick={onClick(item)}
            style={style(item)}
            text={getText(item)}
          />
        ))}
      </div>
    </div>
  );
};

const Button = ({ onClick, style, text }) => (
  <button className="select-btn" style={style} onClick={onClick}>
    <span>{text}</span>
  </button>
);

const FinalStep = ({ s, add, setValue, navigate, complete }) => {
  const nextParcel = () => {
    setValue("count")(s.count + 1);
    navigate(2 + "");
  };

  const Next = () => (
    <div className="navigation">
      <button onClick={nextParcel} style={{ background: "gray" }}>
        ADD PARCEL
      </button>
      <button className="next-parcel" onClick={complete(0 + "")}>
        NEXT ADDRESS
      </button>
    </div>
  );

  const Complete = () => (
    <div className="navigation">
      <button
        className="next-parcel"
        onClick={complete("/")}
        style={{ background: "green" }}
      >
        COMPLETE
      </button>
    </div>
  );

  return (
    <div className="confirmation-screen">
      <Caption title={"add notes"} />
      <input
        className="street-number-input"
        onChange={(e) => setValue("notes")(e.target.value)}
        autoFocus
      />
      <Next />
      <Complete />
    </div>
  );
};

const Caption = ({ title }) => (
  <div className="caption">
    <h2>{title.toUpperCase()}</h2>
  </div>
);

const SuburbCaption = ({ suburb }) => (
  <div className="sn-sub">
    <span>{suburb}</span>
  </div>
);

const NameCaption = ({ name, type }) => (
  <span className="sn-address">
    <strong>{name} </strong> {type}
  </span>
);

const NameButton = ({ location, onClick }) => (
  <button className="street-name-btn" onClick={onClick}>
    <div>
      <SuburbCaption suburb={location.suburb} />
      <NameCaption name={location.name} type={location.type} />
      <RightArrow />
    </div>
  </button>
);
