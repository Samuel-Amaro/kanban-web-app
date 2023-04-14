import React, { useState } from "react";
import DataContextProvider from "../../context/DataContext";
import { ThemeContextProvider } from "../../context/ThemeContext";
import Header from "../Header";
import { SidebarDesktop } from "../Sidebar";
import "./App.css";
import useMatchMedia from "../../hooks/useMatchMedia";
import Content from "../Content";

//TODO: refatorar css de tudo para colors dark porque theme ja esta ativo
//TODO: implementar funcionalidade de salvas datas no localstorage criar function para isso
//TODO: salvar datas, e theme selected in localstorage

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
        <Content />
      </DataContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
