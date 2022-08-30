import { useLocation } from "react-router-dom";
import { Flex, Spinner, Text } from "@chakra-ui/react";

import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { useEffect, useState } from "react";

export default ({ children }) => {
  const { pathname } = useLocation();
  const loading = useLoading();

  // remove layout elements on new package screen
  if (pathname.includes("new")) return children;

  return (
    <Flex
      maxWidth={"800px"}
      flexDir="column"
      m="0 auto"
      boxShadow={"0px 0px 10px var(--ternary-color)"}
    >
      {/* cover  */}
      {loading}

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

const useLoading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return <Loading show={loading} />;
};

export const Loading = ({ show }) => {
  if (!show) return null;
  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      background="black"
      zIndex="200"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="8px"
    >
      <Spinner
        size="xl"
        thickness="4px"
        speed="0.5s"
        emptyColor="white"
        color="var(--ternary-color)"
      />
      <Text color="var(--ternary-color-lightest)" fontWeight="900">
        ❤️
      </Text>
    </Flex>
  );
};
