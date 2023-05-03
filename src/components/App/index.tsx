import { useMemo, useState } from "react";
import { useDataContext } from "../../context/DataContext";
import Header from "../Header";
import { SidebarDesktop } from "../Sidebar";
import "./App.css";
import useMatchMedia from "../../hooks/useMatchMedia";
import Content, { NoContent } from "../Content";

function App() {
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
        mediaQuery: "(min-width: 690px)",
      })}
      {selectedBoard ? (
        <Content selectedBoard={selectedBoard} />
      ) : (
        <NoContent />
      )}
    </>
  );
}

export default App;
