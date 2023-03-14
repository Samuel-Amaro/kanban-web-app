import Button from "../Button";
import Heading from "../Heading";
import ChevronDown from "../Icons/ChevronDown";
import LogoMobile from "../Icons/LogoMobile";
import VerticalEllipsis from "../Icons/VerticalEllipsis";
import { useDataContext } from "../context/DataContext";
import { useThemeContext } from "../context/ThemeContext";
import Logo from "../Icons/Logo";
import ChevronUp from "../Icons/ChevronUp";
import ListBoards from "../ListBoards";
import Switch from "../Switch";
import { useRef } from "react";
import BoardIcon from "../Icons/Board";

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
  const btnSideBar = useRef<HTMLDivElement | null>(null);
  const refsItemsMenu = useRef<HTMLButtonElement[]>([]);
  //TODO: terminade construir este menu button sidebar, pensar na acessibilidade do mesmo
  //TODO: pensar em como mostrar o sidebar mobile resposivo e totalmente acessivel via mouse e teclado
  return (
    <div className="header__group">
      <LogoMobile />
      <div
        ref={btnSideBar}
        className="header__menu-button-sidebar"
        role="button"
        tabIndex={0}
        id="menubutton-sidebar"
        aria-haspopup="true"
        aria-controls="menu-sidebar"
        onPointerDown={() => {
          setIsSidebarHidden(!isSidebarHidden);
        }}
        onKeyDown={(e) => {
          //TODO: APLICAR GERENCIAMENTO DE FOCO AQUI
          switch (e.key) {
            case " ":
            case "Enter":
            case "ArrowDown":
            case "Down":
              //abre o menu via keys
              setIsSidebarHidden(false);
              //TODO: add o focus ao primeiro item do menu apos abrir
              refsItemsMenu.current[0].focus();
              break;
            case "Esc":
            case "Escape":
              //fecha o menu via keys
              setIsSidebarHidden(true);
              //TODO: add o focus para o button sidebar apos fechar o menu
              if (btnSideBar.current) btnSideBar.current.focus();
              break;
            case "Up":
            case "ArrowUp":
              //abre o menu via keys
              setIsSidebarHidden(false);
              //TODO: apos abrir menu o foco vai para o ultimo item de menu
              refsItemsMenu.current[dataContext.datas.length - 1].focus();
              break;
            default:
              break;
          }
        }}
      >
        <Heading level={1} className="header__name-board">
          {dataContext.currentSelectedBoard.name}
        </Heading>
        {isSidebarHidden ? <ChevronDown /> : <ChevronUp />}
      </div>
      {!isSidebarHidden && (
        <div className="header__sidebar-mobile">
          <Heading level={4} className="header__count-boards">
            All Boards ({dataContext.datas.length})
          </Heading>
          <ul
            className="list-boards"
            role="menu"
            id="menu-sidebar"
            aria-labelledby="menubutton-sidebar"
          >
            {dataContext.datas.map((board, index) => {
              //TODO: add classe de active para demostrar na UI qual o board atual selecionado, mas para fazer isso devemos, adicionar ids, nos boards e columns para não comparar com somente nomes
              return (
                <li className="list-boards__item" key={index} role="none">
                  <Button
                    type="button"
                    size="l"
                    className="list-boards__btn list-boards__btn--select-board"
                    aria-label={`Select ${board.name} board`}
                    title={`Select ${board.name} board`}
                    onPointerDown={() => {
                      dataContext.setCurrentSelectedBoard(board);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        dataContext.setCurrentSelectedBoard(board);
                      }
                    }}
                    role="menuitem"
                    ref={(btn) => {
                      if(btn) {
                        refsItemsMenu.current[index] = btn;
                      }
                    }}
                  >
                    <BoardIcon /> {board.name}
                  </Button>
                </li>
              );
            })}
            <li className="sidebar__item" role="none">
              {/*//TODO: adicionar class de forma que destaque esse button dos demais, porque ele tem que visualmente ser destacado*/}
              <Button
                type="button"
                size="l"
                className="list-boards__btn list-boards__btn--create-board"
                aria-label="create new board"
                title={`create new board`}
                onPointerDown={() => {
                  //TODO: chamar function do state do context data para criar um novo board
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    //TODO: chamar function do state do context data para criar um novo board
                  }
                }}
                role="menuitem"
              >
                <BoardIcon /> + Create New Board
              </Button>
            </li>
          </ul>
          <Switch />
        </div>
      )}
    </div>
  );
}

//TODO: TERMINAR DE CONSTRUIRE ESTE COMPONENTE, ADD STATE E INTERATIVIDADE E HTML
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
