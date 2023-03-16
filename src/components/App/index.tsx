import React, { useState } from "react";
import DataContextProvider from "../context/DataContext";
import { ThemeContextProvider } from "../context/ThemeContext";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./App.css";

function App() {
  //este state controla de a sidebar esta oculta ou não, os componentes como header e sidebar usam ele
  //porque no desktop e tables componente sidebar usa o state, no mobile dispositivo, o header usa o componente
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  return (
    <ThemeContextProvider>
      <DataContextProvider>
        <Header
          isSidebarHidden={isSidebarHidden}
          setIsSidebarHidden={setIsSidebarHidden}
        />
        <Sidebar
          isSidebarHidden={isSidebarHidden}
          setIsSidebarHidden={setIsSidebarHidden}
        />
      </DataContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
