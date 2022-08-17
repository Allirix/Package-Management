import { Flex, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { main } from "../../routes";

export default ({ pathname }) => {
  return (
    <Flex
      justifyContent={"space-around"}
      alignItems={"center"}
      background="var(--secondary-color)"
      minHeight="60px"
      boxShadow="inset 0 -5px 10px -10px black, inset 0 5px 7px -10px white"
    >
      {main.map((page) => (
        <NavItem
          key={page.path}
          page={page}
          isSelected={pathname == "/" + page.path}
        />
      ))}
    </Flex>
  );
};

const NavItem = ({ page: { path, Selected, Icon }, isSelected }) => {
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
        <Text fontSize={"10px"} fontWeight="600" opacity="0.8">
          {path.toUpperCase()}
        </Text>
      </Button>
    </Link>
  );
};
