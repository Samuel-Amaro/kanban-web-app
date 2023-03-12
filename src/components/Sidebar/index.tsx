import { useState } from "react";
import Button from "../Button";
import Heading from "../Heading";
import BoardIcon from "../Icons/Board";
import DarkTheme from "../Icons/DarkTheme";
import HideSidebar from "../Icons/HideSidebar";
import LightTheme from "../Icons/LightTheme";
import Switch from "../Switch";
import { useDataContext } from "../context/DataContext";
import ListBoards from "../ListBoards";

export default function Sidebar() {
  const dataContext = useDataContext();

  return (
    <aside className="sidebar">
      <Heading level={4} className="sidebar__title">
        All Boards ({dataContext.datas.length})
      </Heading>
      <ListBoards />
      <div className="sidebar__container-switch">
        <LightTheme />
        <Switch />
        <DarkTheme />
      </div>
      {/*//TODO: mostrar somente em dispositivos como tablets e desktops*/}
      <Button
        type="button"
        size="l"
        title="Hide Sidebar"
        aria-label="Hide Sidebar"
        className="sidebar__btn-hide"
      ><HideSidebar /> Hide Sidebar</Button>
    </aside>
  );
}
