import { useMemo, useState } from "react";
import { useDataContext } from "../../context/DataContext";
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
  const dataContext = useDataContext();
  const selectedBoard = useMemo(
    () => dataContext.datas.find((b) => b.id === dataContext.selectedIdBoard),
    [dataContext]
  );

  function onSidebar(isHidden: boolean) {
    setIsSidebarHidden(isHidden);
  }

  return (
    <>
      <Header
        isSidebarHidden={isSidebarHidden}
        onSidebar={onSidebar}
        selectedBoard={selectedBoard}
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
      {selectedBoard && <Content selectedBoard={selectedBoard} />}
    </>
  );
}

export default App;
