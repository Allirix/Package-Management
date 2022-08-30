import { useDisclosure } from "@chakra-ui/react";
import { createContext, useContext, useState } from "react";
import { useDeliveryDb } from "../../../utils/providers";

const unselected = { parcel: null, index: null, id: null };

const ParcelPopupContext = createContext();
export const useParcelPopup = () => useContext(ParcelPopupContext);

export const ParcelPopupProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dispatch } = useDeliveryDb();
  const [selected, setSelected] = useState(unselected);

  const closePopup = () => [onClose(), setSelected(unselected)];

  const value = {
    selected,
    isOpen,
    setSelected,
    closePopup,
    openPopup: (opened) => () => [onOpen(), setSelected(opened)],

    handleChange: (key) => (e) =>
      setSelected((s) => ({
        ...s,
        parcel: { ...s.parcel, [key]: e.target.value },
      })),

    save: () => {
      dispatch("editParcel", selected);
      closePopup();
    },

    remove: () => {
      dispatch("removeParcel", selected);
      closePopup();
    },
  };

  return (
    <ParcelPopupContext.Provider value={value}>
      {children}
    </ParcelPopupContext.Provider>
  );
};
