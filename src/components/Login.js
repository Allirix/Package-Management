import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";

import { createPlace } from "../model/create";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../logo.png";
import { useAuth } from "../utils/providers/AuthProvider";

export default function Login() {
  const navigate = useNavigate();

  const { login, error } = useAuth();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  function attemptLogin() {
    setLoading(true);
    login(username, password);
    setLoading(false);
  }

  return (
    <>
      <form onSubmit={attemptLogin}>
        <Flex
          flexDirection="column"
          color="white"
          margin="auto"
          h="calc(100vh - 200px)"
          alignItems="center"
          justifyContent="center"
          gap="12px"
          w="50%"
          maxWidth="800px"
          minW="200px"
          fontSize="12px"
          fontWeight="900"
        >
          <Flex flexDirection="column" maxWidth="800px">
            {/* <Text color="var(--ternary-color)">Username</Text> */}
            <InputBox
              type="text"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Flex>
          <Flex flexDirection="column" maxWidth="800px">
            {/* <Text color="var(--ternary-color)" textAlign="left">
              Password
            </Text> */}
            <InputBox
              type={"password"}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Flex>

          <Flex
            onClick={attemptLogin}
            color="white"
            position="fixed"
            bottom="0px"
            left="0"
            flexDirection="column"
            gap="4px"
          >
            <Text
              color="var(--ternary-color)"
              textAlign="center"
              opacity="0.8"
              fontSize="16px"
            >
              {error ? error : "Email allirix@gmail.com to request access"}
            </Text>
            <Button
              background="var(--ternary-color)"
              h="100px"
              width="calc(100vw)"
              fontSize="40px"
              borderRadius="0px"
            >
              {loading ? <Spinner /> : "LOGIN"}
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
}

const InputBox = (props) => (
  <Input
    borderRadius="0"
    height="100px"
    fontFamily='"Quicksand" !important'
    color="var(--ternary-color)"
    className="login"
    width="calc(100vw)"
    fontSize="40px"
    maxWidth="800px"
    m="0px"
    {...{ ...props }}
  />
);
