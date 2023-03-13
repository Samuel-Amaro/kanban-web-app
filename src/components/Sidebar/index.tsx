import Button from "../Button";
import Heading from "../Heading";
import DarkTheme from "../Icons/DarkTheme";
import HideSidebar from "../Icons/HideSidebar";
import LightTheme from "../Icons/LightTheme";
import Switch from "../Switch";
import { useDataContext } from "../context/DataContext";
import ListBoards from "../ListBoards";
import ShowSidebar from "../Icons/ShowSidebar";

type PropsSidebar = {
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  isSidebarHidden,
  setIsSidebarHidden,
}: PropsSidebar) {
  const dataContext = useDataContext();

  //**IMPORTANT: sidebar so pode ser mostrada somente em dispositivos como tablets e desktops

  if (isSidebarHidden) {
    return (
      <Button
        size="l"
        variant="primary"
        className="btn-show-sidebar"
        title="Show Sidebar"
        aria-label="Show Sidebar"
        onPointerDown={() => {
          setIsSidebarHidden(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsSidebarHidden(false);
          }
        }}
      >
        <ShowSidebar />
      </Button>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__container">
        <Heading level={4} className="sidebar__title">
          All Boards ({dataContext.datas.length})
        </Heading>
        <ListBoards type="list"/>
      </div>
      <div className="sidebar__container">
        <div className="sidebar__container-switch">
          <LightTheme />
          <Switch />
          <DarkTheme />
        </div>
        <Button
          type="button"
          size="l"
          title="Hide Sidebar"
          aria-label="Hide Sidebar"
          className="sidebar__btn-hide"
          onPointerDown={() => {
            setIsSidebarHidden(true);
          }}
          onKeyDown={(e) => {
            if(e.key === "Enter" || e.key === " ") {
              setIsSidebarHidden(true);
            }
          }}
        >
          <HideSidebar /> Hide Sidebar
        </Button>
      </div>
    </aside>
  );
}
