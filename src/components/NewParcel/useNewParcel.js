import { useNavigate, useParams } from "react-router-dom";
import { useDeliveryDb } from "../../utils/providers";
import useLocalStorage from "../../utils/hooks/useLocalStorage";

export const defaultStreet = {
  parcels: [],
  suburb: "Suburb auto added",
  type: "",
  number: null,
  name: "<insert-street>",
  count: 0,
  delivered: false,
  atl: 0,
};

export const useNewParcel = () => {
  const { selected, dispatch } = useDeliveryDb();
  const { navigate, step, previous, next, skip } = useNavigation();

  const [newStreet, setNewStreet] = useLocalStorage(
    "new-parcel",
    defaultStreet
  );

  const reset = () => setNewStreet(defaultStreet);

  const setValue = (key) => (value) =>
    setNewStreet((s) => ({ ...s, [key]: value }));

  const setATL = () => setValue("atl")((newStreet.atl + 1) % 3);

  const setNumber = (value) => [setValue("number")(value), next()];

  const setName = (value) => {
    next();

    const exists = selected.findIndex(
      findExisting({ ...value, number: newStreet.number })
    );

    if (exists !== -1 && !selected[exists].delivered)
      return setNewStreet({
        ...selected[exists],
        count: selected[exists].parcels.length,
      });

    setNewStreet((s) => ({ ...s, ...value }));
  };

  const setParcelValue = (key) => (value) =>
    setNewStreet((s) => {
      let parcels = s.parcels.slice(0);
      if (!parcels[s.count]) parcels[s.count] = {};

      if (Array.isArray(key))
        key.forEach((key, i) => (parcels[s.count][key] = value[i]));
      else parcels[s.count][key] = value;

      return { ...s, parcels };
    });

  const complete =
    (to = "/") =>
    () => {
      if (newStreet.parcels.length < 1 || !newStreet.name || !newStreet.suburb)
        return alert("Location not added. Missing name/suburb/parcels");

      const payload = {
        ...newStreet,
        parcels: newStreet.parcels,
      };

      dispatch("add", payload);
      reset();
      navigate(to);
    };

  const onClickParcel = (key) => (value) => () =>
    [setParcelValue(key)(value), next()];
  const onClickParcelSkip = (key) => (value) => () =>
    [setParcelValue(key)(value)];

  return {
    newStreet,
    onClickParcel,
    onClickParcelSkip,
    setNumber,
    setName,
    reset,
    complete,
    setValue,
    next,
    navigate,
    previous,
    skip,
    step,
    setATL,
    exit: () => [navigate("/deliveries"), reset()],
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

const useNavigation = () => {
  const navigate = useNavigate();
  const { step } = useParams();

  return {
    navigate,
    step: Number(step),
    previous: () => navigate(-1),
    next: () => navigate(`${Number(step) + 1}`),
    skip: (n) => navigate(`${Number(step) + n}`),
  };
};
