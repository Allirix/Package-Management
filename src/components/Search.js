import { Button, Flex, Input } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ImUndo } from "react-icons/im";
import { BsGearFill } from "react-icons/bs";
import { useDeliveryDb, useSortedDelivery } from "../utils/providers";

export default function Search() {
  const { search, setSearch } = useSortedDelivery();
  const { undo } = useDeliveryDb();

  return (
    <Flex w="100%" gap="4px" alignItems={"center"}>
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value.toUpperCase())}
        border="none"
      />
      <Button onClick={undo} background="transparent">
        <ImUndo />
      </Button>
      <Link to="/settings">
        <Button background="transparent">
          <BsGearFill />
        </Button>
      </Link>
    </Flex>
  );
}
