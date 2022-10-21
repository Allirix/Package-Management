import { Flex, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { main } from "../../routes";

import { BsPlusLg } from "react-icons/bs";

export default ({ pathname }) => {
  return (
    <Flex
      justifyContent={"space-around"}
      alignItems={"center"}
      minHeight="60px"
      backdropFilter="blur( 4px )"
      borderRadius="0"
      background="white"
    >
      <NavItem page={main[0]} isSelected={pathname == "/" + main[0].path} />
      <NavItem page={main[1]} isSelected={pathname == "/" + main[1].path} />

      <Link to="/new/0">
        <Button
          color="white"
          variant="Whatsapp"
          alignItems="center"
          flexDir="column"
          gap="2px"
          background="green.800"
          width="50px"
          height="50px"
          borderRadius="100%"
          transform="scale(1.2)"
          transformOrigin="bottom"
          border="5px solid white"
        >
          <BsPlusLg size="15px" color="white" />
        </Button>
      </Link>
      <NavItem page={main[2]} isSelected={pathname == "/" + main[2].path} />
      <NavItem page={main[3]} isSelected={pathname == "/" + main[3].path} />
    </Flex>
  );
};

const NavItem = ({ page: { path, Selected, Icon }, isSelected = false }) => {
  return (
    <Link to={`/${path}`}>
      <Button
        color={isSelected ? "green.900" : "green.800"}
        variant="Whatsapp"
        alignItems="center"
        flexDir="column"
        gap="2px"
        transition="all 0.3s"
        opacity={isSelected ? 1 : 0.6}
        boxShadow={isSelected ? "inset 0 0 8px gray" : ""}
      >
        {isSelected ? <Selected size="25px" /> : <Icon size="25px" />}
        {/* <Text fontSize="8px" fontWeight="900">
          {path.toUpperCase()}
        </Text> */}
      </Button>
    </Link>
  );
};
