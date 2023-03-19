import Button from "../Button";
import Heading from "../Heading";
import HideSidebar from "../Icons/HideSidebar";
import Switch from "../Switch";
import { useDataContext } from "../context/DataContext";
import ListBoards from "../ListBoards";
import ShowSidebar from "../Icons/ShowSidebar";
import "./Sidebar.css";

type PropsSidebar = {
  isSidebarHidden: boolean;
  //setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
  onSidebar: (isHidden: boolean) => void;
};

export default function Sidebar({
  isSidebarHidden,
  //setIsSidebarHidden,
  onSidebar
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
          onSidebar(false);
          //setIsSidebarHidden(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onSidebar(false);
            //setIsSidebarHidden(false);
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
        <Switch />
        <Button
          type="button"
          size="l"
          title="Hide Sidebar"
          aria-label="Hide Sidebar"
          className="sidebar__btn-hide"
          onPointerDown={() => {
            onSidebar(true);
            //setIsSidebarHidden(true);
          }}
          onKeyDown={(e) => {
            if(e.key === "Enter" || e.key === " ") {
              onSidebar(true);
              //setIsSidebarHidden(true);
            }
          }}
        >
          <HideSidebar /> Hide Sidebar
        </Button>
      </div>
    </aside>
  );
}
