import { Flex, Text } from "@chakra-ui/react";
import useAnimation from "../../utils/hooks/useAnimation";

export default ({ percentage }) => {
  const elastic = useAnimation("inExpo", 1200, 0);
  const animatedPercentage = isNaN(percentage)
    ? 0
    : Math.round(elastic * percentage);
  const bg = `conic-gradient(from 0deg at 50% 50%, 
      var(--secondary-color-light) 0%, 
      var(--secondary-color-light) ${animatedPercentage}%, 
      rgba(0,0,20,0.2) ${animatedPercentage}%)`;

  const s = "180px";
  const s2 = "140px";
  return (
    <Flex
      bg={bg}
      h={s}
      w={s}
      m="0 auto"
      justifyContent="center"
      alignItems="center"
      borderRadius="100%"
    >
      <Flex
        h={s2}
        w={s2}
        borderRadius="100%"
        bg="rgba(255, 255,255,1)"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        color="var(--secondary-color)"
      >
        <Text fontSize="50px" fontWeight="700">
          {animatedPercentage}%
        </Text>
        <Text
          textAlign="center"
          fontWeight={900}
          fontSize="14px"
          textTransform="uppercase"
        >
          Complete
        </Text>
      </Flex>
    </Flex>
  );
};
