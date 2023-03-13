import Button from "../Button";
import Heading from "../Heading";
import ChevronDown from "../Icons/ChevronDown";
import LogoMobile from "../Icons/LogoMobile";
import VerticalEllipsis from "../Icons/VerticalEllipsis";
import { useDataContext } from "../context/DataContext";
import { useThemeContext } from "../context/ThemeContext";
import Logo from "../Icons/Logo";
import ChevronUp from "../Icons/ChevronUp";

type PropsSidebar = {
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

//TODO: ADICIONAR LOGICA DE ESTADO

export default function Header({
  isSidebarHidden,
  setIsSidebarHidden,
}: PropsSidebar) {
  const dataContext = useDataContext();
  const themeContext = useThemeContext();
  return (
    <header className="header">
      {/*//* * IMPORTANT: mostrar somente a partir de dispositivos como tablets e desktops*/}
      <div className="header__group">
        <div className="header__logo">
          <Logo theme={themeContext.theme} />
        </div>
        <Heading level={1} className="header__name-board">
          {dataContext.currentSelectedBoard.name}
        </Heading>
      </div>
      {/*
        //* IMPORTANT: mostrar somente em layout mobile
        //TODO: usar state definido em apçp para mostrar ou ocultar a side bar em versão mobile
        //TODO: implementar um menu button que ira abrir um menu com options de boards e o switch componente, que ira controlar se pode ou não mostrar um sidebar mobile
      */}
      <MenuButtonSidebar
        isSidebarHidden={isSidebarHidden}
        setIsSidebarHidden={setIsSidebarHidden}
      />
      {/*--------*/}
      <div className="header__container">
        <Button type="button" size="l" variant="primary" title="Add New Task">
          + Add New Task
        </Button>
        {/*
          //TODO: ADICIONAR INTERATIVIDADE VIA MOUSE E TECLADO
          //TODO: OPTIONS QUE IRÃO CHAMAR MODAIS PARA EDITAR E DELETAR UM BOARD
        */}
        <MenuButtonBoard />
      </div>
    </header>
  );
}

interface PropsMenuButtonSidebar extends PropsSidebar {}

function MenuButtonSidebar({
  isSidebarHidden,
  setIsSidebarHidden,
}: PropsMenuButtonSidebar) {
  const dataContext = useDataContext();
  //TODO: terminade construir este menu button sidebar, pensar na acessibilidade do mesmo
  //TODO: pensar em como mostrar o sidebar mobile resposivo e totalmente acessivel via mouse e teclado
  return (
    <div className="header__group">
      <LogoMobile />
      <div className="header__menu-button-sidebar">
        <Heading level={1} className="header__name-board">
          {dataContext.currentSelectedBoard.name}
        </Heading>
        {isSidebarHidden ? <ChevronDown /> : <ChevronUp />}
      </div>
    </div>
  );
}

function MenuButtonBoard() {
  return (
    <div className="header__menu-button-board">
      <button
        type="button"
        className="header__btn-board"
        title="Show options for current board"
        id="menubutton1"
        aria-haspopup="true"
        aria-controls="menu1"
      >
        <VerticalEllipsis />
      </button>
      <ul
        id="menu1"
        role="menu"
        aria-labelledby="menubutton1"
        className="header__menu-board"
      >
        <li role="menuitem" className="header__menu-item">
          Edit Board
        </li>
        <li role="menuitem" className="header__menu-item">
          Delete Board
        </li>
      </ul>
    </div>
  );
}
