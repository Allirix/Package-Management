import { Flex } from "@chakra-ui/react";
import { BiRun } from "react-icons/bi";
import { BsSquareHalf } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";

import FirstParcel from "../src/components/FirstDelivery";
import PercentageCard from "./PercentageCard";
import useStatCard from "../src/utils/hooks/useStatCard";
import ClosestPlace from "./ClosestPlace";
import InfoCard from "./InfoCard";

export default () => {
  const { percentage, parcels, speed, places, total } = useStatCard();

  if (total < 1) return <FirstParcel />;

  return (
    <Flex
      flexDir="column"
      gap="4px"
      height="calc(100vh - 120px - 16px)"
      alignItems="center"
      justifyContent="center"
      w="100%"
      m="4px"
    >
      <PercentageCard percentage={percentage} />
      <br />
      <Flex
        overflowX="auto"
        gap="4px"
        justifyContent="space-between"
        alignItems="space-between"
        w="100%"
      >
        <InfoCard Icon={BsSquareHalf} value={parcels} title="Parcels" />
        <InfoCard value={places} title="Places" Icon={FiMapPin} />
        <InfoCard value={speed} title="Per Hour" Icon={BiRun} />
      </Flex>
      <ClosestPlace />
    </Flex>
  );
};
