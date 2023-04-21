import { useState } from "react";
import "./App.css";
import { Box, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import SongGrid from "./components/SongGrid";
import CategoryList from "./components/CategoryList";
import { Category } from "./hooks/useCategories";
import NotationSelector from "./components/NotationSelector";
import { Notation } from "./hooks/useSongs";
import SortSelector from "./components/SortSelector";
import SearchInput from "./components/SearchInput";
import SongHeading from "./components/SongHeading";
import Register from "./components/Register";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Admin from "./components/common/Admin";
import Editor from "./components/common/Editor";
import Home from "./components/common/Home";
import Layout from "./components/common/Layout";
import Lounge from "./components/common/Lounge";
import Missing from "./components/common/Missing";
import RequireAuth from "./components/common/RequireAuth";
import Unauthorized from "./components/common/Unauthorized";
import HomePage from "./components/common/HomePage";

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
