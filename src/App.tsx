import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/common/HomePage";
import Layout from "./components/common/Layout";
import Missing from "./components/common/Missing";
import Unauthorized from "./components/common/Unauthorized";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home" element={<HomePage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
