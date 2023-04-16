import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@chakra-ui/react";

function App() {
  const [count, setCount] = useState(0);

  return <Button colorScheme="blue">Button</Button>;
}

export default App;
