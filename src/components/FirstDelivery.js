import { Link } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useDeliveryDb } from "../utils/providers";

import d from "../data/data.json";

export default () => {
  const { set } = useDeliveryDb();

  return (
    <Link to="/new/0">
      <Flex justifyContent="center" alignItems="center" h="60vh" w="100%">
        <Flex flexDir="column" alignItems="center" gap="32px">
          <Text
            color="green.800"
            fontSize="32px"
            fontWeight="900"
            fontFamily="'Montserrat', sans-serif"
          >
            ADD PARCEL
          </Text>
          <Button
            transform="scale(2)"
            bg="green.800"
            borderRadius="100%"
            w="40px"
            h="40px"
            p="0"
          >
            <BsPlusLg color="white" />
          </Button>
          {/* <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              loadData(set);
            }}
          >
            {"Load test Data".toUpperCase()}
          </Button> */}
        </Flex>
      </Flex>
    </Link>
  );
};

const data = (id) => ({
  id,

  createdAt: 1660071324902,
  delivered: false,
  updatedAt: 1660071324902,
  deliveredAt: null,
  parcels: [{ type: "BOX", size: "S", color: "TARGET" }],
  suburb: ["Mitchelton", "Keperra", "Upper Kedron", "Gaythorne"][
    Math.floor(Math.random() * 4)
  ],
  type: "Pl",
  number: "2345",
  name: "Balnaves",
  count: 0,
  distance: null,
  atl: Math.floor(Math.random() * 3),
  similarity: 0,
  lat: -27.4133804,
  lng: 152.963608,
});

const loadData = (set) => {
  const db = d; //new Array(300).fill(0).map((e, i) => data(i));
  set(db);
};
