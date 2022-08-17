import { useConst } from "@chakra-ui/react";
import { Polygon } from "@react-google-maps/api";
import { mapData, options } from "./utils";

export default () =>
  useConst(
    () =>
      mapData.map((path, i) => {
        return <Polygon key={i} paths={path} options={options(i)} />;
      }),
    []
  );
