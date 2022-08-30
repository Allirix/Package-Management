import { Flex, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { main } from "../../routes";

import { AiOutlinePlus } from "react-icons/ai";

export default ({ pathname }) => {
  return (
    <Flex
      justifyContent={"space-around"}
      alignItems={"center"}
      background="var(--secondary-color)"
      minHeight="60px"
      boxShadow="inset 0 -5px 10px -10px black, inset 0 5px 7px -10px white"
    >
      <NavItem page={main[0]} isSelected={pathname == "/" + main[0].path} />

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
          boxShadow="0 0 5px var(--ternary-color)"
        >
          <AiOutlinePlus
            size="25px"
            color="black"
            filter={`drop-shadow(0 0 1px black )`}
          />
        </Button>
      </Link>
      <NavItem page={main[1]} isSelected={pathname == "/" + main[1].path} />
    </Flex>
  );
};

const NavItem = ({ page: { path, Selected, Icon }, isSelected = false }) => {
  return (
    <Link to={`/${path}`}>
      <Button
        color="var(--ternary-color-lightest)"
        variant="Whatsapp"
        alignItems="center"
        flexDir="column"
        gap="2px"
      >
        {isSelected ? <Selected size="25px" /> : <Icon size="25px" />}
        {/* <Text fontSize={"10px"} fontWeight="600" opacity="0.8">
          {path.toUpperCase()}
        </Text> */}
      </Button>
    </Link>
  );
};
