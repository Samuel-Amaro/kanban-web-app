import Button from "../Button";
import Heading from "../Heading";
import ChevronDown from "../Icons/ChevronDown";
import LogoMobile from "../Icons/LogoMobile";
import VerticalEllipsis from "../Icons/VerticalEllipsis";
import { useDataContext } from "../context/DataContext";
import { useThemeContext } from "../context/ThemeContext";
import Logo from "../Icons/Logo";
import ChevronUp from "../Icons/ChevronUp";
import Switch from "../Switch";
import React, { useRef, useState } from "react";
import BoardIcon from "../Icons/Board";
import "./test.css";
import { Board } from "../../data";

type PropsSidebar = {
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

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

//TODO: PULAR O PROBLEMA DO GERENCIAMENTO DE FOCO E CONTRUIR OS MENUS LOGO DEPOIS PENSAR EM COMO GERENCIAR O FOCO

//interface PropsMenuButtonSidebar extends PropsSidebar {}

function MenuButtonSidebar({
  isSidebarHidden,
  setIsSidebarHidden,
}: PropsSidebar) {
  const dataContext = useDataContext();
  const btnSideBar = useRef<HTMLDivElement | null>(null);
  const refsItemsMenu = useRef<HTMLButtonElement[] | null>(null);

  function getRefsItemsMenu() {
    if (!refsItemsMenu.current) {
      refsItemsMenu.current = [];
    }
    return refsItemsMenu.current;
  }

  function setToFocus(itemId: number) {
    const refItems = getRefsItemsMenu();
    const item = refItems[itemId];
    item.focus();
  }

  function setToFocusPreviousItem(itemCurrent: HTMLButtonElement) {
    const refItems = getRefsItemsMenu();
    let menuItemSelected = null;
    if (itemCurrent === refItems[0]) {
      menuItemSelected = itemCurrent;
    } else {
      const index = refItems.indexOf(itemCurrent);
      menuItemSelected = refItems[index - 1];
    }
    menuItemSelected.focus();
  }

  function setFocusNextItem(itemCurrent: HTMLButtonElement) {
    const refItems = getRefsItemsMenu();
    let menuItemSelected = null;
    if (itemCurrent === refItems[refItems.length - 1]) {
      menuItemSelected = itemCurrent;
    } else {
      const index = refItems.indexOf(itemCurrent);
      menuItemSelected = refItems[index + 1];
    }
    menuItemSelected.focus();
  }

  function handleKeyDownBtnSideBar(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "Down":
        //abre o menu via keys
        setIsSidebarHidden(false);
        //add o focus ao primeiro item do menu apos abrir
        setToFocus(0);
        break;
      case "Esc":
      case "Escape":
        //fecha o menu via keys
        setIsSidebarHidden(true);
        //add o focus para o button sidebar apos fechar o menu
        if (btnSideBar.current) btnSideBar.current.focus();
        break;
      case "Up":
      case "ArrowUp":
        //abre o menu via keys
        setIsSidebarHidden(false);
        //apos abrir menu o foco vai para o ultimo item de menu
        setToFocus(dataContext.datas.length - 1);
        break;
      default:
        break;
    }
  }

  function handleKeyDownBtnBoard(
    e: React.KeyboardEvent<HTMLButtonElement>,
    board: Board
  ) {
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    } else {
      switch (e.key) {
        case "Esc":
        case "Escape":
          btnSideBar.current?.focus();
          setIsSidebarHidden(true);
          break;
        case "Up":
        case "ArrowUp":
          setToFocusPreviousItem(e.currentTarget);
          break;
        case "ArrowDown":
        case "Down":
          setFocusNextItem(e.currentTarget);
          break;
        case "Home":
        case "PageUp":
          setToFocus(0);
          break;
        case "End":
        case "PageDown":
          setToFocus(getRefsItemsMenu().length - 1);
          break;
        case "Enter":
        case " ":
          dataContext.setCurrentSelectedBoard(board);
          break;
        default:
          break;
      }
    }
  }

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
        title={
          isSidebarHidden ? "View sidebar boards" : "Hidden sidebar boards"
        }
        onPointerDown={() => {
          setIsSidebarHidden(!isSidebarHidden);
        }}
        aria-expanded={isSidebarHidden ? true : false}
        onKeyDown={(e) => {
          handleKeyDownBtnSideBar(e);
        }}
      >
        <Heading level={1} className="header__name-board">
          {dataContext.currentSelectedBoard.name}
        </Heading>
        {isSidebarHidden ? <ChevronDown /> : <ChevronUp />}
      </div>
      <div
        className={
          isSidebarHidden
            ? "header__sidebar-mobile header__sidebar-mobile--hide"
            : "header__sidebar-mobile"
        }
      >
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
                  className={
                    board.id === dataContext.currentSelectedBoard.id
                      ? "list-boards__btn list-boards__btn--select-board list-boards__btn--active"
                      : "list-boards__btn list-boards__btn--select-board"
                  }
                  aria-label={`Select ${board.name} board`}
                  title={`Select ${board.name} board`}
                  onPointerDown={() => {
                    dataContext.setCurrentSelectedBoard(board);
                  }}
                  onKeyDown={(e) => {
                    handleKeyDownBtnBoard(e, board);
                  }}
                  role="menuitem"
                  ref={(btn) => {
                    const refItems = getRefsItemsMenu();
                    if (btn) {
                      refItems[index] = btn;
                    } else {
                      refItems.splice(index, 1);
                    }
                  }}
                >
                  <BoardIcon className="list-boards__icon-btn-select-board" />
                  {board.name}
                </Button>
              </li>
            );
          })}
          <li className="list-boards__item" role="none">
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
              <BoardIcon className="list-boards__icon-btn-create-board" /> +
              Create New Board
            </Button>
          </li>
        </ul>
        <Switch />
      </div>
    </div>
  );
}


function MenuButtonBoard() {
  const [isHiddenMenuBoard, setIsHiddenMenuBoard] = useState(true);
  const refsButtons = useRef<HTMLButtonElement[] | null>(null);
  const refBtnBoadMenu = useRef<HTMLButtonElement>(null);

  function getRefs() {
    if (!refsButtons.current) {
      refsButtons.current = [];
    }
    return refsButtons.current;
  }

  function setToFocus(itemId: number) {
    const refsBtns = getRefs();
    refsBtns[itemId].focus();
  }

  function setToFocusPreviousItem(itemCurrent: HTMLButtonElement) {
    const refItems = getRefs();
    let menuItemSelected = null;
    if (itemCurrent === refItems[0]) {
      menuItemSelected = itemCurrent;
    } else {
      const index = refItems.indexOf(itemCurrent);
      menuItemSelected = refItems[index - 1];
    }
    menuItemSelected.focus();
  }

  function setFocusNextItem(itemCurrent: HTMLButtonElement) {
    const refItems = getRefs();
    let menuItemSelected = null;
    if (itemCurrent === refItems[refItems.length - 1]) {
      menuItemSelected = itemCurrent;
    } else {
      const index = refItems.indexOf(itemCurrent);
      menuItemSelected = refItems[index + 1];
    }
    menuItemSelected.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    } else {
      switch (e.key) {
        case "Esc":
        case "Escape":
          refBtnBoadMenu.current?.focus();
          setIsHiddenMenuBoard(true);
          break;
        case "Up":
        case "ArrowUp":
          setToFocusPreviousItem(e.currentTarget);
          break;
        case "ArrowDown":
        case "Down":
          setFocusNextItem(e.currentTarget);
          break;
        case "Home":
        case "PageUp":
          setToFocus(0);
          break;
        case "End":
        case "PageDown":
          setToFocus(getRefs().length - 1);
          break;
        case "Enter":
        case " ":
          //TODO: chama o modal necessario de acordo com o button clicado da option
          break;
        default:
          break;
      }
    }
  }

  return (
    <div className="header__menu-button-board">
      <button
        type="button"
        className="header__btn-board"
        title={
          isHiddenMenuBoard
            ? "Show options for current board"
            : "Hidden options board"
        }
        id="menubutton1"
        aria-haspopup="true"
        aria-controls="menu1"
        aria-expanded={isHiddenMenuBoard ? true : false}
        aria-label="Options to actions in boards"
        onPointerDown={() => {
          setIsHiddenMenuBoard(!isHiddenMenuBoard);
        }}
        onKeyDown={(e) => {
          switch (e.key) {
            case " ":
            case "Enter":
            case "ArrowDown":
            case "Down":
              //abre o menu via keys
              setIsHiddenMenuBoard(false);
              //add o focus ao primeiro item do menu apos abrir
              setToFocus(0);
              break;
            case "Esc":
            case "Escape":
              //fecha o menu via keys
              setIsHiddenMenuBoard(true);
              //add o focus para o button sidebar apos fechar o menu
              if (refBtnBoadMenu.current) refBtnBoadMenu.current.focus();
              break;
            case "Up":
            case "ArrowUp":
              //abre o menu via keys
              setIsHiddenMenuBoard(false);
              //apos abrir menu o foco vai para o ultimo item de menu
              setToFocus(getRefs().length - 1);
              break;
            default:
              break;
          }
        }}
        ref={refBtnBoadMenu}
      >
        <VerticalEllipsis />
      </button>
      <ul
        id="menu1"
        role="menu"
        aria-labelledby="menubutton1"
        className={
          isHiddenMenuBoard
            ? "header__menu-board header__menu-board--hide"
            : "header__menu-board"
        }
      >
        <li role="none" className="header__menu-item">
          <button
            type="button"
            className="header__btn-board header__btn-board--edit"
            role="menuitem"
            aria-label="Edit current board"
            title="Edit current board"
            ref={(btn) => {
              const refItems = getRefs();
              if (btn) {
                refItems.push(btn);
              } else {
                refItems.splice(0, 1);
              }
            }}
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
          >
            Edit Board
          </button>
        </li>
        <li role="none" className="header__menu-item">
          <button
            type="button"
            className="header__btn-board header__btn-board--delte"
            role="menuitem"
            aria-label="Delete current board"
            title="Delete current board"
            ref={(btn) => {
              const refItems = getRefs();
              if (btn) {
                refItems.push(btn);
              } else {
                refItems.splice(1, 1);
              }
            }}
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
          >
            Delete Board
          </button>
        </li>
      </ul>
    </div>
  );
}
