import React, { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { getData, handleRequest } from "./utils/api";
import { Md5 } from "ts-md5";
import Input from "./ui/input/Input";
import useDebounce from "./hooks/useDebounce";
import { auth } from "./utils/helpers";
import Shop from "./pages/shop/Shop";
import Layout from "./components/layout/Layout";
import Header from "./components/header/Header";

function App() {
  return (
    <>
      <Header />
      <Layout children={<Shop />} />
    </>
  );
}

export default App;
