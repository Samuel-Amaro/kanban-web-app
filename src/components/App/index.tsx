import React, { useState } from "react";
import DataContextProvider from "../context/DataContext";
import { ThemeContextProvider } from "../context/ThemeContext";
import Header from "../Header";
import Sidebar, { SidebarDesktop } from "../Sidebar";
import "./App.css";
import useMatchMedia from "../../hooks/useMatchMedia";

function App() {
  //este state controla de a sidebar esta oculta ou não, os componentes como header e sidebar usam ele
  //porque no desktop e tables componente sidebar usa o state, no mobile dispositivo, o header usa o componente
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  function onSidebar(isHidden: boolean) {
    setIsSidebarHidden(isHidden);
  }

  return (
    <ThemeContextProvider>
      <DataContextProvider>
        <Header
          isSidebarHidden={isSidebarHidden}
          onSidebar={onSidebar}
          //setIsSidebarHidden={setIsSidebarHidden}
        />
        {useMatchMedia({
          mobileContent: null,
          desktopContent: (
            <SidebarDesktop
              isSidebarHidden={isSidebarHidden}
              onSidebar={onSidebar}
            />
          ),
          mediaQuery: "(min-width: 450px)",
        })}
        {/*<Sidebar
          isSidebarHidden={isSidebarHidden}
          onSidebar={onSidebar}
          //setIsSidebarHidden={setIsSidebarHidden}
          />*/}
      </DataContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
