import { useLocation } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

export default ({ children }) => {
  const { pathname } = useLocation();

  // remove layout elements on new package screen
  if (pathname.includes("new")) return children;

  return (
    <Flex
      maxWidth={"800px"}
      flexDir="column"
      m="0 auto"
      boxShadow={"0px 0px 5px black"}
    >
      <TopBar />
      <Container>{children}</Container>
      <BottomBar pathname={pathname} />
    </Flex>
  );
};

// fill space between bars. Sticky & fixed not used since these solutions dont respond to minWidth media queries as well
const Container = ({ children }) => (
  <Flex
    justifyContent={"center"}
    // sets height to fill. #TODO: Error on mobiles since 100vh does not include the browser header
    maxHeight="calc(100vh - 60px - 60px)"
    h="calc(100vh - 60px - 60px)"
    overflowY="auto" // Allows content to be scrollable
    w="100%"
  >
    {children}
  </Flex>
);
