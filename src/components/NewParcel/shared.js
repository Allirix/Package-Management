import {
  Stack,
  FormControl,
  Input,
  Button as ChButton,
  Flex,
} from "@chakra-ui/react";

import { MdArrowBackIos, MdClose, MdOutlineChevronRight } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { useNewParcel } from "./useNewParcel";

// prevent default from being called on submit
export const preventDefault = (fn) => (e) => {
  e.preventDefault();
  fn(e);
};

// { onClick, text, Icon, width: "100%", background: "" }
export const Button = (P) => {
  const { icon: Icon, ...props } = P;

  return (
    <ChButton
      leftIcon={Icon && <Icon />}
      onClick={props.onClick}
      fontSize="40px"
      textShadow="1px 1px 1px black"
      color={props.color ? props.color : "white"}
      width={props.width}
      minHeight="67px"
      background={props.background}
      fontFamily={"Montserrat"}
      fontWeight="800"
      {...props}
    >
      {props.children}
    </ChButton>
  );
};

export const Navigation = ({ buttons }) => (
  <Flex justifyContent="space-around" p="0 16px" gap="16px">
    {buttons.map((button, i) => (
      <Button
        onClick={button.onClick}
        text={button.text}
        background={button.color}
        width="100%"
        key={i}
      >
        {button.text}
      </Button>
    ))}
  </Flex>
);

export const Caption = ({ title }) => {
  const navigation = useNavigate();
  const { reset } = useNewParcel();
  return (
    <CaptionBasic title={title}>
      <button type="button" onClick={(e) => navigation(-1)}>
        <MdArrowBackIos size="1.5rem" color="white" />
      </button>
      <button
        type="button"
        onClick={(e) => [navigation("/deliveries"), reset()]}
      >
        <MdClose size="2rem" color="white" />
      </button>
    </CaptionBasic>
  );
};

export const CaptionBasic = ({
  title,
  children = [null, null],
  color = "white",
  background = "green.800",
}) => {
  return (
    <Flex className="caption" background="green.800">
      {children["0"]}
      <h2 style={{ color }}>{title.toUpperCase()}</h2>
      {children["1"]}
    </Flex>
  );
};

export const BigInput = ({
  value,
  onChange,
  inputMode = null,
  autoFocus = true,
  helperText,

  ...styles
}) => {
  const isNumeric = inputMode === "numeric";
  const id = isNumeric ? "numeric" : "location";

  return (
    <FormControl>
      <Input
        className="big-input"
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        inputMode={inputMode}
        variant="unstyled"
        id={id}
        type={isNumeric ? "number" : "text"}
        placeholder={helperText}
        fontFamily={`"Montserrat", sans-serif`}
        fontWeight="bold"
        autoComplete="off"
        {...{ ...styles }}
      />
    </FormControl>
  );
};

export const SingleInputForm = ({ children, onSubmit, input }) => {
  return (
    <BasicForm onSubmit={onSubmit}>
      <Stack>
        <BigInput
          onChange={input.onChange}
          value={input.value}
          inputMode={input.inputMode}
          autoFocus={input.autoFocus}
          helperText={input.helperText}
        />
        {children}
      </Stack>
    </BasicForm>
  );
};

export const BasicForm = ({ children, onSubmit }) => {
  return (
    <form onSubmit={preventDefault(onSubmit)}>
      <Stack>{children}</Stack>
    </form>
  );
};
