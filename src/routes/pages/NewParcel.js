import {
  useNewParcel,
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
import { Flex } from "@chakra-ui/react";

export default function NewParcel() {
  const np = useNewParcel();

  const titles = [
    "Street Number",
    "Street Name",
    "Parcel",
    "Size",
    "Color",
    "Notes",
  ];

  const step = (() => {
    switch (np.step) {
      case 0:
        return <NumberInput set={np.setNumber} />;
      case 1:
        return <NameInput set={np.setName} />;
      case 2:
        return (
          <TypeInput
            title="Box Type"
            list={["Bag", "Box"]}
            onClickParcelSkip={np.onClickParcelSkip}
            onClick={np.onClickParcel}
            skip={np.skip}
          />
        );
      case 3:
        return (
          <ColorInput
            title="Box Size"
            list={["L", "M", "S"]}
            onClick={np.onClickParcel("size")}
          />
        );
      case 4:
        return (
          <ColorInput
            title="Box Colour"
            list={colors}
            onClick={np.onClickParcel("color")}
          />
        );
      case 5:
        return (
          <FinalStep
            notes={np.newStreet.notes}
            atl={np.newStreet.atl}
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
    <Flex
      flexDir="column"
      maxWidth="800px"
      margin="0 auto"
      background="var(--secondary-color-light)"
      minHeight="100vh"
      boxShadow="0 0 10px black"
    >
      <Caption title={titles[np.step] ?? "Error 404"} />
      <Place street={np.newStreet} editATL={np.setATL} show={false} />
      {step}
    </Flex>
  );
}
