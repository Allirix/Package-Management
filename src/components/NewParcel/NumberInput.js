import { Text } from "@chakra-ui/react";
import { useState } from "react";
import { SingleInputForm } from "./shared";

const NumberStep = ({ set }) => {
  const [value, setValue] = useState("");

  const onChange = (e) => setValue(e.target.value);

  const onSubmit = () => set(value);

  return (
    <SingleInputForm
      onSubmit={onSubmit}
      input={{
        onChange,
        value,
        inputMode: "numeric",
        helperText: "Enter a number",
      }}
    >
      <Text>THIS IS TEXT</Text>
    </SingleInputForm>
  );
};

export default NumberStep;
