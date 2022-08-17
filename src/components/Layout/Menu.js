import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
  Button,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { menu } from "../../routes";

export default () => {
  return (
    <Flex justifyContent="center">
      <Popover placement="bottom" isLazy>
        <PopoverTrigger>
          <IconButton icon={<BsThreeDotsVertical />} variant="ghost" />
        </PopoverTrigger>
        <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
          <PopoverArrow />
          <PopoverBody>
            <Stack>
              {menu.map(({ path, Icon }, i) => (
                <Link to={"/" + path} key={i}>
                  <Button
                    variant="ghost"
                    leftIcon={<Icon />}
                    color="var(--secondary-color)"
                  >
                    {path.toUpperCase()}
                  </Button>
                </Link>
              ))}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
