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
      background="rgba( 0, 0, 0, 0.45 )"
      backdropFilter="blur( 4px )"
      borderRadius="0"
      borderTop="1px solid var(--ternary-color)"
      borderBottom="none"
    >
      <NavItem page={main[0]} isSelected={pathname == "/" + main[0].path} />
      <NavItem page={main[1]} isSelected={pathname == "/" + main[1].path} />

      <Link to="/new/0">
        <Button
          color="var(--ternary-color-lightest)"
          variant="Whatsapp"
          alignItems="center"
          flexDir="column"
          gap="2px"
          background="var(--ternary-color-lightest)"
          width="40px"
          height="40px"
          borderRadius="100%"
          transform="scale(1.5)"
          transformOrigin="bottom"
        >
          <BsPlusLg size="15px" color="black" />
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
        color={
          isSelected ? "var(--ternary-color-lightest)" : "var(--ternary-color)"
        }
        variant="Whatsapp"
        alignItems="center"
        flexDir="column"
        gap="2px"
        transition="all 0.3s"
        _focus={{ transform: "scale(1.2)" }}
        _hover={{ transform: "scale(1.2)" }}
        opacity={isSelected ? 1 : 0.6}
      >
        {isSelected ? <Selected size="25px" /> : <Icon size="25px" />}
        <Text fontSize={"8px"} fontWeight="600" opacity="0.8">
          {path.toUpperCase()}
        </Text>
      </Button>
    </Link>
  );
};
