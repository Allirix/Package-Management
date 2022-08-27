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
  useClipboard,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { menu } from "../../routes";
import { useDeliveryDb } from "../../utils/providers";

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useCopyToClipboard } from "react-use";

export default () => {
  const [state, copyToClipboard] = useCopyToClipboard();

  const { selected, dispatch } = useDeliveryDb();

  const url = compressToEncodedURIComponent(JSON.stringify(selected));

  console.log({ state, url });

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
              <Button onClick={() => copyToClipboard(url)}>Export</Button>
              <Button
                onClick={() =>
                  navigator.clipboard.readText().then((text) => {
                    const data = JSON.parse(
                      decompressFromEncodedURIComponent(text)
                    );
                    if (!data)
                      alert(
                        `Invalid data - ${text}. Attempted to convert to: ${data}`
                      );
                    dispatch("overwrite", data);
                  })
                }
              >
                Import
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
