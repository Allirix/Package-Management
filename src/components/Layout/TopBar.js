import { useLocation, useNavigate } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Search from "../Search";
import Menu from "./Menu";

export default () => {
  return (
    <Flex
      background="white"
      color="green.800"
      alignItems={"center"}
      justifyContent="space-between"
      minHeight="60px"
      p="0 8px"
      boxShadow="0 0 4px 0px black"
    >
      <Search />
      {/* <Menu /> */}
    </Flex>
  );
};
