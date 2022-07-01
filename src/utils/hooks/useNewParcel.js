import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStreetContext } from "../providers";
import useLocalStorage from "./useLocalStorage";

export const defaultStreet = {
  parcels: [],
  suburb: "Mitchelton",
  type: "",
  number: "",
  name: "",
  count: 0,
  distance: null,
};
export const useNewParcel = () => {
  const { selected } = useStreetContext();

  const navigate = useNavigate();
  const { formState } = useParams();
  const { add } = useStreetContext();

  const [newStreet, setNewStreet] = useLocalStorage(
    "new-parcel",
    defaultStreet
  );

  useEffect(() => {
    const exists = selected.findIndex(
      findExisting({ ...newStreet.name, number: newStreet.number })
    );
    console.log(
      exists,
      { ...newStreet, number: newStreet.number },
      selected[0]
    );
    if (exists === -1) return;

    const existing = selected[exists];

    setNewStreet({ ...existing, count: existing.parcels.length });
  }, [selected, newStreet]);

  const next = () => navigate(`${Number(formState) + 1}`);
  const reset = () => setNewStreet(defaultStreet);

  const setValue = (key) => (value) =>
    setNewStreet((s) => ({ ...s, [key]: value }));

  const setParcelValue = (key) => (value) =>
    setNewStreet((s) => {
      let parcels = s.parcels.slice(0);
      if (!parcels[s.count]) parcels[s.count] = {};
      parcels[s.count][key] = value;
      return { ...s, parcels };
    });

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

  const onClickParcel = (type) => (e) => () =>
    [setParcelValue(type)(e), next()];
  const onClickLocation = (type) => (e) => () => [setValue(type)(e), next()];

  return {
    newStreet,
    onClickParcel,
    onClickLocation,
    reset,
    complete,
    setValue,
    next,
    navigate,
    formState: Number(formState),
    exit: () => [navigate("/"), reset()],
    previous: () => navigate(-1),
    nextParcel: () => {
      setValue("count")(newStreet.count + 1);
      navigate(2 + "");
    },
  };
};

const findExisting = (st) => (ex) =>
  ex.type === st.type &&
  ex.number === st.number &&
  ex.suburb === st.suburb &&
  ex.name === st.name;
