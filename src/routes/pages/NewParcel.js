import {
  Street as Place,
  FinalStep,
  NameInput,
  NumberInput,
  ColorInput,
  TypeInput,
  colors,
  Caption,
} from "../../components/NewParcel";
import "../../components/NewParcel/NewParcel.css";
import { Flex, useToast } from "@chakra-ui/react";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDeliveryDb } from "../../utils/providers";
import { getUrlParamsFromPlace } from "../../utils/hooks/utils";

export default function NewParcel() {
  const { step, place, setParam, nextParcel, complete } = useNewParcel();
  const titles = ["Street Name", "Parcel", "Color", "Notes"];

  const Step = (() => {
    switch (step) {
      case "0":
        return <NameInput set={setParam("name")} />;
      case "1":
        return <TypeInput onClick={setParam} />;
      case "2":
        return <ColorInput onClick={setParam("color", 3)} />;
      case "3":
        return (
          <FinalStep
            notes={place.notes}
            setNotes={setParam("notes", 3)}
            nextParcel={nextParcel}
            complete={complete}
          />
        );
      default:
        return <>404 Error: Return to Home</>;
    }
  })();

  return (
    <Flex
      flexDir="column"
      maxWidth="800px"
      margin="0 auto"
      background="var(--secondary-color-light)"
      minHeight="100vh"
      // boxShadow="0 0 10px black"
    >
      <Caption title={titles[step] ?? "Error 404"} />
      {step !== "0" && (
        <Flex
          flexDirection="column"
          p="4px 8px 8px 8px"
          position="fixed"
          w="100%"
          bottom="0"
          zIndex="10"
          maxWidth="800px"
        >
          <Place street={place} editATL={setParam("atl", 3)} show={false} />
        </Flex>
      )}
      {Step}
    </Flex>
  );
}

const tryParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return "";
  }
};

const findExisting = (st) => (ex) =>
  ex.type === st.type &&
  ex.number === st.number &&
  ex.suburb === st.suburb &&
  ex.name === st.name;

const useNewParcel = () => {
  const { step } = useParams();
  const nav = useNavigate();
  const { dispatch, selected } = useDeliveryDb();
  const [p] = useSearchParams();

  const [place, setPlace] = useState(getInitialState(p, selected));

  const toast = useToast();

  function reset() {
    setPlace(placeProp);
  }

  function setParam(key, page = parseInt(step) + 1) {
    return (value) => {
      let p;

      switch (key) {
        case "parcels":
          p = { ...place, parcels: place.parcels.concat(JSON.parse(value)) };
          break;

        case "color":
          place.parcels[place.parcels.length - 1] = {
            ...place.parcels[place.parcels.length - 1],
            color: value,
          };
          p = { ...place, parcels: place.parcels };
          break;

        case "name":
          p = { ...place, ...value };
          const exists = selected.findIndex(findExisting(p));
          if (exists !== -1) p = { ...p, ...selected[exists] };
          break;

        default:
          p = { ...place };
          p[key] = value;
      }

      page !== "NO_NAV" && nav(getUrlParamsFromPlace(page, p));
      setPlace(p);
    };
  }

  return {
    step,
    place,
    setParam,
    nextParcel: () => nav(getUrlParamsFromPlace("1", place)),
    complete: (url) => {
      const callback = () => {
        try {
          reset();
          toast({
            position: "top",
            title: "Place added.",
            description: `Added ${place.parcels.length} parcels to ${
              place.number
            } ${place.name} ${place.type}, ${place.suburb}. (${
              place?.lat ? "append" : "add"
            })`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          nav(url);
          return true;
        } catch (e) {
          console.error(e);
          alert(JSON.stringify(e));
          return false;
        }
      };
      dispatch("add", place, callback);
    },
  };
  // number, name, type, suburb,
};

const placeProp = {
  number: "",
  name: "",
  suburb: "",
  type: "",
  parcels: [],
  atl: 0,
  notes: "",
};

const getInitialState = (p, selected) => () => {
  const params = Object.keys(placeProp)
    .map((key) => {
      const value = p.getAll(key);
      return {
        key,
        value: value.length > 1 ? tryParse(value) : tryParse(value[0]),
      };
    })
    .reduce((acc, { key, value }) => {
      if (key === "parcels" && value === "") acc[key] = [];
      else if (key === "atl" && value === "") acc[key] = 0;
      else acc[key] = value;

      return acc;
    }, {});

  const exists = selected.findIndex(findExisting(params));
  return exists > -1 ? selected[exists] : params;
};
