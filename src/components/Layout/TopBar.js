import { useLocation, useNavigate } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Search from "../Search";
import Menu from "./Menu";

export default () => {
  return (
    <Flex
      background={"var(--secondary-color)"}
      color="var(--ternary-color-lightest)"
      alignItems={"center"}
      justifyContent={"space-between"}
      minHeight="60px"
      p="0 1rem"

      // boxShadow="inset 0 -5px 10px -10px black, inset 0 5px 7px -10px white"
    >
      <Search />
      {/* <Menu /> */}
    </Flex>
  );
};
