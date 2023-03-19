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
import iconTaskMobile from "../../assets/images/icon-add-task-mobile.svg";
import ListBoards from "../ListBoards";
import "./Header.css";

type PropsSidebar = {
  isSidebarHidden: boolean;
  onSidebar: (isHidden: boolean) => void;
};

export default function Header({ isSidebarHidden, onSidebar }: PropsSidebar) {
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
      {/*//* IMPORTANT: mostrar somente em layout mobile*/}
      <MenuButtonSidebar
        isSidebarHidden={isSidebarHidden}
        onSidebar={onSidebar}
      />
      <div className="header__container-buttons">
        <Button
          type="button"
          size="l"
          variant="primary"
          title="Add New Task"
          className="header__btn-add-task"
        >
          <span className="header__text-btn-add-task">+ Add New Task</span>
          <img
            src={iconTaskMobile}
            alt=""
            aria-hidden="true"
            className="header__icon-btn-add-task"
          />
        </Button>
        <MenuButtonBoard />
      </div>
    </header>
  );
}

//interface PropsMenuButtonSidebar extends PropsSidebar {}

function MenuButtonSidebar({ isSidebarHidden, onSidebar }: PropsSidebar) {
  const dataContext = useDataContext();
  const btnSideBar = useRef<HTMLDivElement | null>(null);
  const [indexItemMenuFocus, setIndexItemMenuFocus] = useState<number | null>(
    null
  );

  function handleKeyDownBtnSideBar(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "Down":
        //abre o menu via keys
        onSidebar(false);
        //add o focus ao primeiro item do menu apos abrir
        setIndexItemMenuFocus(0);
        break;
      case "Esc":
      case "Escape":
        //fecha o menu via keys
        onSidebar(true);
        //add o focus para o button sidebar apos fechar o menu
        if (btnSideBar.current) btnSideBar.current.focus();
        break;
      case "Up":
      case "ArrowUp":
        //abre o menu via keys
        onSidebar(false);
        //apos abrir menu o foco vai para o ultimo item de menu
        setIndexItemMenuFocus(dataContext.datas.length - 1);
        break;
      default:
        break;
    }
  }

  function onCloseSidebar() {
    btnSideBar.current?.focus();
    onSidebar(true);
  }

  return (
    <div className="header__group">
      <LogoMobile className="header__icon header__icon--logo" />
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
          onSidebar(!isSidebarHidden);
        }}
        aria-expanded={isSidebarHidden ? true : false}
        onKeyDown={(e) => {
          handleKeyDownBtnSideBar(e);
        }}
      >
        <Heading level={2} className="header__name-board">
          {dataContext.currentSelectedBoard.name}
        </Heading>
        {isSidebarHidden ? (
          <ChevronDown className="header__icon header__icon--chevron-down" />
        ) : (
          <ChevronUp className="header__icon header__icon--chevron-up" />
        )}
      </div>
      <div
        className={
          isSidebarHidden
            ? "header__backdrop-sidebar header__backdrop-sidebar--hidden"
            : "header__backdrop-sidebar"
        }
      >
        <div className="header__sidebar-mobile">
          <Heading level={4} className="header__count-boards">
            All Boards ({dataContext.datas.length})
          </Heading>
          <ListBoards
            id="menu-sidebar"
            aria-labelledby="menubutton-sidebar"
            onCloseWrapper={onCloseSidebar}
            setIdItemToFocus={
              typeof indexItemMenuFocus === "number"
                ? indexItemMenuFocus
                : undefined
            }
          />
          <Switch />
        </div>
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
          //TODO: modal para deletar ou editar board
          break;
        default:
          break;
      }
    }
  }

  return (
    <div className="header__menu-button-board">
      <Button
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
        <VerticalEllipsis className="header__icon" />
      </Button>
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
