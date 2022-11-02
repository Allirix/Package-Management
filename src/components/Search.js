import {
  Button,
  Flex,
  Input,
  Tag,
  TagLabel,
  TagRightIcon,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUndoAlt } from "react-icons/fa";
import { BsGearFill, BsFillPlusCircleFill } from "react-icons/bs";
import { useDeliveryDb, useSortedDelivery } from "../utils/providers";
import { MdAddRoad, MdSettings } from "react-icons/md";
import { HiOutlineChevronLeft } from "react-icons/hi";

export default function Search() {
  const { search, setSearch } = useSortedDelivery();
  const { undo } = useDeliveryDb();

  const navigation = useNavigate();
  const { pathname } = useLocation();

  const showBack = !["/home", "/", "/deliveries", "/map"].includes(pathname);

  return (
    <Flex w="100%" alignItems={"center"}>
      {showBack && (
        <Button
          onClick={() => navigation(-1)}
          background="transparent"
          ml="-10px"
        >
          <HiOutlineChevronLeft size="25px" />
        </Button>
      )}

      <Flex
        alignItems="center"
        justifyContent="center"
        position="relative"
        width="100%"
        h="100%"
        top="0"
        left="0"
      >
        <Input
          position="absolute"
          left="0"
          bottom="0"
          transform="translateY(50%)"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
          border="none"
          w="100%"
        />
        {/* <Flex
          position="absolute"
          right="0"
          bottom="0"
          transform="translateY(50%)"
          gap="4px"
          color="var(--ternary-color)"
        >
          <Tag variant="outline" colorScheme="whiteAlpha">
            <TagLabel>P</TagLabel>
          </Tag>
          <Tag variant="outline" colorScheme="whiteAlpha">
            <TagLabel>25</TagLabel>
          </Tag>
          <Tag variant="outline" colorScheme="whiteAlpha">
            <TagLabel>25/12</TagLabel>
          </Tag>
        </Flex> */}
      </Flex>

      <Button onClick={undo} background="transparent">
        <FaUndoAlt />
      </Button>
      <Link to="/settings">
        <Button background="transparent">
          <BsGearFill />
        </Button>
      </Link>
    </Flex>
  );
}
