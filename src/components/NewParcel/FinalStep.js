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
            color: "var(--secondary-color)",
          },
          {
            onClick: () => complete(0 + ""),
            text: "NEXT",
            color: "var(--primary-color)",
          },
        ]}
      />
      <Navigation
        buttons={[
          {
            onClick: () => complete("/deliveries"),
            text: "COMPLETE",
            color: "var(--ternary-color)",
          },
        ]}
      />
    </SingleInputForm>
  );
};

export default FinalStep;
