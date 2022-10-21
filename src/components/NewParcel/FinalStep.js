import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Navigation, SingleInputForm } from "./shared";

const FinalStep = ({ setNotes, complete, nextParcel, notes }) => {
  return (
    <SingleInputForm
      onSubmit={() => complete("/deliveries")}
      input={{
        value: notes,
        autoFocus: false,
        helperText: "Enter notes",
        onChange: (e) => setNotes(e.target.value),
      }}
    >
      <Navigation
        buttons={[
          {
            onClick: nextParcel,
            text: "PARCEL",
            color: "orange.500",
          },
          {
            onClick: () => complete(0 + ""),
            text: "NEXT",
            color: "red.500",
          },
        ]}
      />
      <Navigation
        buttons={[
          {
            onClick: () => complete("/deliveries"),
            text: "COMPLETE",
            color: "green.800",
          },
        ]}
      />
    </SingleInputForm>
  );
};

export default FinalStep;
