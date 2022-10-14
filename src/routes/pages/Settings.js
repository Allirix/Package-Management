import { useEffect, useMemo, useState } from "react";
import { useDeliveryLocations } from "../../utils/providers/LocationProvider";
import { downloadObj } from "../../utils/hooks/useDeliveryLocations";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";

import { BiImport } from "react-icons/bi";
import { FiCopy } from "react-icons/fi";

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useCopyToClipboard } from "react-use";
import { useDeliveryDb } from "../../utils/providers";

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { signout } from "../../utils/firebase/signout";
import { createPlace } from "../../model/create";
import { useAuth } from "../../utils/providers/AuthProvider";

export default function Settings() {
  let { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  const { logout } = useAuth();

  const { selected, dispatch } = useDeliveryDb();

  const [importValue, setImportValue] = useState("");

  return (
    <Flex flexDirection="column" width="100%" p="1rem" gap="16px">
      <Button
        onClick={() => (logout(), navigate("/login"))}
        color="white"
        background="var(--ternary-color)"
      >
        Logout
      </Button>

      <Button onClick={() => createPlace({ test: "test" })} color="black">
        Create Place
      </Button>
    </Flex>
  );
}

const useClipboard = () => {
  const { dispatch } = useDeliveryDb();

  const [clipboard, setClipboard] = useState("");

  useEffect(() => {
    navigator.clipboard.readText().then((text) => {
      setClipboard(text);
    });
  }, []);

  return clipboard;
};

const defaultState = {
  suburb: "Mitchelton",
  name: "",
  type: "",
  priority: 0,
};
const AddLocation = ({ add, setShowAdd }) => {
  const [state, setState] = useState(defaultState);

  const onChange = (key) => (e) =>
    setState((s) => ({ ...s, [key]: e.target.value }));

  const onClick = () => {
    if (state.name.length > 0) {
      add(state);
      setState(defaultState);
      setShowAdd((t) => !t);
    }
  };

  return (
    <form className="add-location">
      <select
        value={state.suburb}
        type="text"
        placeholder="Suburb..."
        onChange={onChange("suburb")}
      >
        <option value="Mitchelton">Mitchelton</option>
        <option value="Upper Kedron">Upper Kedron</option>
        <option value="Keperra">Keperra</option>
        <option value="Gaythorne">Gaythorne</option>
      </select>
      <input
        value={state.name}
        type="text"
        placeholder="Location Name..."
        onChange={onChange("name")}
      />
      <input
        value={state.type}
        type="text"
        placeholder="Street Type?"
        onChange={onChange("type")}
      />
      <input
        value={state.priority}
        type="text"
        placeholder="Priority?"
        onChange={onChange("priority")}
      />
      <input type="button" value="Add" onClick={onClick} />
    </form>
  );
};

const tryParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error(e);
    return { error: true };
  }
};

function getValues() {
  return "NobwRAlgJmBcAMAaMBjATgUwIYBcNQEEc4BGANjPngHYSBmAJgBYBOeB5KDAGwgDcMmGLABmWbgGcMyAK4AHKLnxFSFeCRbkmAVnplOPfoOXFY5Mg3g6S9GiWRysaFDwlxgAXWQSZAIxlovnBgAKpycoIABADS+GgA9gB2YMg4AJ4RwQAK3ClgiTIAtr6CwQx0OnmJWIUYwQBC4tUCbsgo8TKJpkhgUBASOFiJLnAF3NzIuLmwHGASEIUQ3E4Q6XA9y6YAtAzUAHRM9HQAHFbI3IkA5qTaDHssZHSUxwC+iODQpG2YSoSm5lRaIxWOwDLwBEI4GJJNIwPJFHg-qpKHZgWxZlxwcYkWYKJZrCQmBR7GBHM5XO4vHM-AEgrAwLEImg0Fg8ulMvSclUiiU0GUKtoqjU6vTGhcsC08u1Ot1OP1BsMRWMJmApnBZvNFss0Ks0utzrg4Dt9oc6CczmALtczLd7o9nm8PsJZuhsIiVLiUUDmOiwUZIaJxFJZApfh6AaifaDeoYISZkfjdOR4McSWSXJJKd4aYFggBZVYoAAWPBwSTZGRFYC5yAKxVK9PKlVrwoaTQlGFaqA6XX1vXlQxGsGVkxw0x6mqWKzWCAN212ByOpyY5yuNzuDyeKcdkGEdG+bvjnsB9CjGNj2KhQdh8LD-zUkZB56xQnDeKsSeo1AYxwcTgzbiwJ42b+Lm9IFjgxaluWqSVtkuS1jyDZgE2gotrUbbipKbQ9rK-YDIOSoyOMo7jt4CxTjqM4bIasDGouZrLqu1okLam4Ou8u5wCuqA-O695eqeT5+nGwjQsGcKhvxyInmi0aYv6R7mCQxxmiwqkPGm-4UkBVI+KBdIMhgTIshWHLVgh+RIXyjYCkKGGiu22HdjKfZ9ARiqjMRKpqrOcwUdqup9psRoLqa5o8Va652lurycZ8sDaAed4yY+voxi++BXjCIYIkpD7esJGWKTiI6ktpmZAeA7JVvUADyAAaeTzAAXlWADKUrxNw8Q2WAAAqBAAEoAOIAKL9WALx6TmhkQVB3BlsksHmTWVn1n1qH2bVTmdl1rl+e5CpDmVvkTgF056n5IV0WFS4WlFNobva27xcI+i8YeOIRoV6UKaJ2USbe0nHml8kXq+phlemOmgGANUNI1zUQG1wSdThPV9YNo0TVNM0GcEjKCKZK1Vmtda8vyzb5K2jlYXtOEHT0R2EV5JGqmO6rkVql3BbR9HhUxlprk9MUcU6cDUMlIM-UJf0Q1lgY5ZJeXfQVcvg5lpXeX+5KVXDCOikj5Go-S6PdpjwTY+Nk3TSBtKE8ZxOsqT8HchtVNoTTDlgGKzQMy5vaHQOnnDjrHPTBqF1UVdNHzia92RSLrHPbFO4Jb+n0paDv2ayVgM3lJ+WCXJz4lR60MVYBBtwUbTUmx1XWW-S1u43b1IE+BhYlotMHw7XFnu5TtnU9UPt+x2XbSkHzMhyd4dndzlFBdd-N3YxD3J2xL1xRLsAsNLxeyWeImXkrQNF2rJcn8VokV+HMP69VA-1fX-mm2A5vtM3A3DTbeP2zAmAEaWA0g4CLL1RIdRXackshTZCW10I7XplPXCbk55EXZovfyPMY583jgxCKzForsVenvEgPRXTZ1lqXU+AZxKF1Vm+SgGhyC3CoPuW+2J77s0ftXZ+5lX7Iw-l-bqvUrZ-zbvjB29IwhMhiHEPuhtB6IQ9iPL2Y9kH+1QUzOUHl55YM5jMJegVqJzlCgnDeScWLbzTm9UgJIqEy3VrQrh9Dry5WoS4m+-1uFQwflXdwAjarG3fo3DG4iW6SNttIoBcioixCgAkZa-dVpwOsp7bamFtH7Rnno46mCfJGPOrgleccLGEKFo9FOYsyFcTMC6PiR8wZlwBufRhXjr5FV8ZDNmKo+FBNSSEt+rVwkW0ib-HGMTAGGRAWAiBaAoFmTJuktRKE7JIOyZPXJeEWah1OkYkkk5TGx3MbdSxRDhY2NTuLep9BD5X2Pt0hWYkPEq06U8+WWseH9MCVVIZiMRkozGd-CZrdpkdxkaEcICTFEpOUeTDJ6isl0xyYzPJ+ECl9NIlzHBy8zGWjXhcqpW8bl1ISoSB5zDPl5zaQwzxziulfPLv43hfya6CNCaMtGTcwXRIAZCoB80e5LWWW7VRw91mj1pr7XaOiMV7IMUUsieKTn4IqYLTe1zam7zuUlLOjKaWtLPvS95hqWl0KPJXPW-CAV12ESCsRWN+Xt30lCuZ4DIHQLtSo9akrEHey0ds9FuyMHYojl8VVvNV4EM1dYkhO907CHIFSgSRrLWvOVsDZpudjW9LDmym1gzlFCIbjyiJzqpkCrdUAomzIXY+sRWsgNmitnOWnqG-RhScV+WOdG8p5zKlaoTXY8hUsDU5o1nmxWprs2PItW4q1ASi3-JLVy4F5bxmVv-q62awR4loAUUkpRA8m3+o2YGttAcO3oK7eG3yUdSkEpugLROxDRakN1RSzOTjJ2uJ6TOt5c7qULoA9rQtAFi0v3XSI3l26pEzMdiZBtCLVnnulePOVOzb1YoLcqvsfa8Exo1W+q5I7bkUoPhO+duaM0FwZX+nxLyfm60g6u6DQLYMVokVW3dncjLIbFbAoeCCL2ttRcGwOnbcMHJVYRspZzX1WPfTUz9Sb1SUKaTRqddH2kMe0-+5jrLfkro5cMh1m7QXwYhTWua3doLwtPWh0TGGg3trQcHO9eGe1HOjgpwlsbSPVNsRR50jitMgdo4uzNF8mFptA0Z8NAz2Ocs446n+4Lq17vpB6hZSyYG+vgZtMTMqJ7ud0Zi1m3mI3GKjURgdSnLnBbJV+50jSvqRZ09F+jZrGPPO+cZ1jsNgmAos2bODPGd2xMMgeo9yShOFaRVKjRpWsMhpw1V2Tkb5PPqJUO+NH7E32JmJw39BmmNax68B+LUWwMsfKqZkb9qy3je41E3j03gi5a9Qts9LmVuYZQdhzzMmF5GMffi05AWSPKbI4d0d9TmCptSrdl5V3L6dcMwNpL7Knu+xg+lvlH3EP0jrSTRtzniuuavfK6Tm2wdyb87twLsPms6vUzMfVZ3McXfznp3r53+sspx49n1pawmWadZNhDgrDJk5Q05kTVOAduevR52eXmtu1Z21Dl968mukvZ8dhgH1uc3a62B9HcWUcW8S9V5LZnRsvc-hN97U2SfQvkYk+bBW-vK5RbKoH62Qf08MdMXzT7dd7bjSpkL5LnTjrNzbrHfPZ0Y-Nynu+g2Htscd89iXr2t3S5s9l4BoDPWLO9ahpXmTNkSfKwqsN1XsE6-VYOmPcPVNHb3j+ZHOdbeXf59d5PvOs8i9z3j8X3LC9WeL1l-jwqHO-cp7Xy99e1cVcVd2mrJTIdt8ayS7VanjdUaT-3zPJqgPp5H0Lsf9vcdi4J5LjLLrPtd0giKk9aSa-Irr4HtFUmG2+yDOuKrexG7eQWhux+e8dAmmHWGeo+l+Wa1+5+iB+a1qE+j+aWz+RO7usuX25eeWVeiuEq-2AeZWG+jemuIBZgJi-aim+uh+5G8ecAdA4W8BN+zKdKV+1uqBt+fi4+w2WBY2Lub2kyeBtmSGzsy+P+y25Ba2gBIewBYeoBTOUeLOBuR+3e9SjAfeNCaBgGyBvB+h-B6By6mBa62BM+UubuMukhsiMKh63uX+KyshLaq2QeihGuoOKhvaah++jBw68OoWrBp2EWCBphhhsWHyCW2O9+oulhIhoiL+xO+BDhXucKMhpB-uf+FBtOQBSqPaEOaq4BB+QRXeCOCUFQeh3ikRMWHS5qqOcRGBQhiRzuyRuBdhpei+vcjm3+2Rq+4m-+kmN6ShhRNWEee+pRgRB2FRIRsAdAXO4RnBtKSB0RjRA+wu8RFhHGSRru4hXR-Gs2zhfRrhAxv+a+wxDedOyh+GfhkeARxK5RcerWrBpuyxfBXBaxDRfWXxZhEGrRux7R+xmWfGUK8uWRfqZBuRChox3hoedxu+JRDWMxseLWHOdAieHxJhfxURPxguuJ4GJmOxqWexYhoJb+YAPRoqvuK+FxQxeRwO8JtxPaSJ9B0OEBrOUB2hVRP62JtRhJVuMRTRWxLRT8whwJ5Jr+Hu1JLh4qUJORlxjJwezJ4xD6dB9WDBTxsxLxGJp+-JTKqx7iRhwpmxd+YptqbRBeohRethJeRxjhc2cpwm5xchMJnhcJ+SCJRRGp-meu2paJRue8TAcBppF+xp6xvxRpS6AJ4pVp0+Nps+dp8+7qhBP2tJbhJWgOABnplWLJExvpzOMOmhzBrxsAhwNRhp069R+mPOdR92Duk+T+1hKREhpexxmRGZrp7h2ZIx6uXp+ZvkkxyJWp+2gZ0B9STA7WYZBhNZAudZhJDZD+8ZG6LZnR9pUKsppx8pRWgxHhOZ-ZeZaphyhZ6hxZTBwRLB5ZYRHBnx0Zc5w+d51ZS5CRQJ1pHR1mKZcSjpJxkJu59J+5fZm+TeWuw57J-pY5neupx2TAPEZ+OJ95QpGx4ZMZxJgJpJkptpBxG5taTs9af5S2PZqu+RYx2+Q5p5jxkFbOE5CUOglZ6a3WQ+KBCFz52ejZEp75IJ0paRVJ9mvRBFzaWZxFTJA5x54eFF0xAZUF6JMF7xt5LFumaexhAp95L5JJ5mmFSZ2FX5M2P5nZFOmZ1O6+JFqpZFJ5dWfp0ekBWhlRwgTAWJ8lKl1ZSFUZrFghcZb5CZH5c+YJ35GRx625LpCpe5vZ1xBRZljODxklVF3Jtl3EfJjlVZilPBM59ZbFy5nlq5iZNh2lvlsyaZleAl6GKuNOIlR5EVqhUVKJUl1FPJdl+piVDFluTFylSV0Wal6FGlnFUpqR9hvFH+S+XZwVAFoVlBNxYlBG-h0VHetVcViUoZyFs5LlBJql6Vr5GF3VWFFJMpfFNJBl3ZQlpVKpolFV9xUx1VMVNl8xug9FsRqeKVi1aV7llpmVXGW13FfVW5RV0JSpsJh5W+964OElF1M1sV1105j1gpLVqVi5a16lTum1Wl21PFH";
}
