import Button from "../Button";
import Heading from "../Heading";
import ChevronDown from "../Icons/ChevronDown";
import LogoMobile from "../Icons/LogoMobile";
import VerticalEllipsis from "../Icons/VerticalEllipsis";
import { useDataContext } from "../../context/DataContext";
import { useThemeContext } from "../../context/ThemeContext";
import Logo from "../Icons/Logo";
import ChevronUp from "../Icons/ChevronUp";
import React, { useEffect, useRef, useState } from "react";
import iconTaskMobile from "../../assets/images/icon-add-task-mobile.svg";
import useMatchMedia from "../../hooks/useMatchMedia";
import { SidebarMobile } from "../Sidebar";
import "./Header.css";
import BoardModal from "../Modals/BoardModal";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { getFocusableElements, nextFocusable } from "../../utils";

type PropsSidebar = {
  isSidebarHidden: boolean;
  onSidebar: (isHidden: boolean) => void;
};

export default function Header({ isSidebarHidden, onSidebar }: PropsSidebar) {
  const dataContext = useDataContext();

  return (
    <header className="header">
      {useMatchMedia({
        mobileContent: (
          <MenuButtonSidebarMobile
            isSidebarHidden={isSidebarHidden}
            onSidebar={onSidebar}
          />
        ),
        desktopContent: <DesktopContent />,
        mediaQuery: "(min-width: 450px)",
      })}
      <div className="header__container-buttons">
        <Button
          type="button"
          size="l"
          variant="primary"
          title="Add New Task"
          className="header__btn-add-task"
          disabled={dataContext.selectedBoard.columns.length > 0 ? false : true}
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

function DesktopContent() {
  const dataContext = useDataContext();
  const themeContext = useThemeContext();
  return (
    <div className="header__group">
      <div className="header__logo">
        <Logo
          theme={themeContext.theme}
          className="header__icon-logo-desktop"
        />
      </div>
      <Heading level={1} className="header__name-board">
        {dataContext.selectedBoard.name}
      </Heading>
    </div>
  );
}

//interface PropsMenuButtonSidebar extends PropsSidebar {}

function MenuButtonSidebarMobile({ isSidebarHidden, onSidebar }: PropsSidebar) {
  const dataContext = useDataContext();
  const btnSideBar = useRef<HTMLDivElement | null>(null);
  const [typeActionFocus, setTypeActionFocus] = useState<
    "first" | "last" | undefined
  >(undefined);
  const [modalCreateBoardIsOpen, setModalCreateBoardIsOpen] = useState(false);

  function handleKeyDownBtnSideBar(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "Down":
        //abre o menu via keys
        onSidebar(false);
        //add o focus ao primeiro item do menu apos abrir
        setTypeActionFocus("first");
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
        setTypeActionFocus("last");
        break;
      default:
        break;
    }
  }

  function handleCloseSidebar() {
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
          {dataContext.selectedBoard.name}
        </Heading>
        {isSidebarHidden ? (
          <ChevronDown className="header__icon header__icon--chevron-down" />
        ) : (
          <ChevronUp className="header__icon header__icon--chevron-up" />
        )}
      </div>
      <SidebarMobile
        id="menu-sidebar"
        aria-labelledby="menubutton-sidebar"
        onCloseWrapper={handleCloseSidebar}
        typeActionFocusOpenMenu={typeActionFocus}
        isSidebarHidden={isSidebarHidden}
        onModalCreateBoardIsOpen={(isOpen: boolean) =>
          setModalCreateBoardIsOpen(isOpen)
        }
      />
      {modalCreateBoardIsOpen && (
        <BoardModal
          type="add"
          isOpen={modalCreateBoardIsOpen}
          onHandleOpen={(isOpen: boolean) => {
            btnSideBar.current?.focus();
            setModalCreateBoardIsOpen(isOpen);
          }}
        />
      )}
    </div>
  );
}

//TODO: ao clicar fora fechar este dropdown
//TODO: FOCAR AQUI AGORA PARA CHAMAR NOVOS MODAIS

type DataButton = {
  text: string;
  action: "edit" | "delete";
};

function MenuButtonBoard() {
  const [isHiddenMenuBoard, setIsHiddenMenuBoard] = useState(true);
  //const refsButtons = useRef<HTMLButtonElement[] | null>(null);
  const refBtnBoadMenu = useRef<HTMLButtonElement>(null);
  const refBtnDropdow = useRef<HTMLDivElement | null>(null);
  const dataButtons: DataButton[] = [
    { text: "Edit", action: "edit" },
    { text: "Delete", action: "delete" },
  ];
  const [typeActionFocus, setTypeActionFocus] = useState<
    "first" | "last" | undefined
  >(undefined);

  function handleOnCloseWrapper() {
    refBtnBoadMenu.current?.focus();
    setIsHiddenMenuBoard(true);
  }

  /*function getRefs() {
    if (!refsButtons.current) {
      refsButtons.current = [];
    }
    return refsButtons.current;
  }*/

  /*function setToFocus(itemId: number) {
    const refsBtns = getRefs();
    refsBtns[itemId].focus();
  }*/

  /*function setToFocusPreviousItem(itemCurrent: HTMLButtonElement) {
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
  */

  /*function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    action: string
  ) {
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
  */

  /*function handlePointerDownBtnOptionBoard(
    e: React.PointerEvent<HTMLButtonElement>,
    action: string
  ) {
    switch (action) {
      case "edit":
        //TODO: modal de editar board
        break;
      case "delete":
        //TODO: modal de deletar board
        break;
      default:
        break;
    }
  }*/

  /*function handlePointerDownDropdown(e: PointerEvent) {
    if (
      refBtnDropdow.current?.contains(e.target as Node) &&
      (refBtnDropdow.current as HTMLElement) !== e.target
    ) {
      return;
    }
    setIsHiddenMenuBoard(true);
  }

  useEffect(() => {
    console.log("montagem");
    document.addEventListener("pointerdown", handlePointerDownDropdown);

    return () => {
      console.log("desmontage");
      document.removeEventListener("pointerdown", handlePointerDownDropdown);
    };
  }, []);
  */

  //useOnClickOutside(refBtnDropdow, handlePointerDownDropdown);

  return (
    <div
      className="header__menu-button-board"
      ref={refBtnDropdow}
      /*onPointerDown={handlePointerDownDropdown}*/
    >
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
              //setToFocus(0);
              setTypeActionFocus("first");
              break;
            case "Esc":
            case "Escape":
              //fecha o menu via keys
              setIsHiddenMenuBoard(true);
              //add o focus para o button sidebar apos fechar o menu
              setTypeActionFocus(undefined);
              if (refBtnBoadMenu.current) refBtnBoadMenu.current.focus();
              break;
            case "Up":
            case "ArrowUp":
              //abre o menu via keys
              setIsHiddenMenuBoard(false);
              //apos abrir menu o foco vai para o ultimo item de menu
              //setToFocus(getRefs().length - 1);
              setTypeActionFocus("last");
              break;
            default:
              break;
          }
        }}
        ref={refBtnBoadMenu}
      >
        <VerticalEllipsis className="header__icon" />
      </Button>
      {/*<ul
        id="menu1"
        role="menu"
        aria-labelledby="menubutton1"
        className={
          isHiddenMenuBoard
            ? "header__menu-board header__menu-board--hide"
            : "header__menu-board"
        }
      >
        {dataButtons.map((data, index) => {
          return (
            <li role="none" className="header__menu-item" key={index}>
              <button
                type="button"
                className={`header__btn-board-${data.action}`}
                role="menuitem"
                aria-label={`${data.text} current board`}
                title={`${data.text} current board`}
                ref={(btn) => {
                  const refItems = getRefs();
                  if (btn) {
                    refItems.push(btn);
                  } else {
                    refItems.splice(0, 1);
                  }
                }}
                onPointerDown={(e) => {
                  handlePointerDownBtnOptionBoard(e, data.action);
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e, data.action);
                }}
              >
                {`${data.text} Board`}
              </button>
            </li>
          );
        })}
      </ul>*/}
      {!isHiddenMenuBoard && (
        <ListButtonsMenuBoard
          id="menu1"
          role="menu"
          aria-labelledby="menubutton1"
          className="header__menu-board"
          datasButtons={dataButtons}
          onCloseWrapper={handleOnCloseWrapper}
          typeActionFocusOpenMenu={typeActionFocus}
          onMenuBoardHidden={(isHidden: boolean) =>
            setIsHiddenMenuBoard(isHidden)
          }
          refWrapper={refBtnDropdow}
        />
      )}
    </div>
  );
}

interface PropsListButtonsMenuBoard
  extends React.ComponentPropsWithoutRef<"ul"> {
  onCloseWrapper?: () => void;
  datasButtons: DataButton[];
  typeActionFocusOpenMenu?: "first" | "last";
  onMenuBoardHidden?: (isHidden: boolean) => void;
  refWrapper: React.MutableRefObject<HTMLElement | null>;
}

function ListButtonsMenuBoard(props: PropsListButtonsMenuBoard) {
  const {
    className,
    datasButtons,
    onCloseWrapper,
    typeActionFocusOpenMenu,
    onMenuBoardHidden,
    refWrapper,
    ...rest
  } = props;
  const refsButtons = useRef<HTMLButtonElement[] | null>(null);
  const refList = useRef<HTMLUListElement | null>(null);

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

  function handlePointerDownDropdown() {
    if (onMenuBoardHidden) onMenuBoardHidden(true);
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    action: string
  ) {
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    } else {
      switch (e.key) {
        case "Esc":
        case "Escape":
          if (onCloseWrapper) onCloseWrapper();
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
        case "Tab":
          e.preventDefault();
          nextFocusable(getFocusableElements(refList.current), !e.shiftKey);
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

  function handlePointerDownBtnOptionBoard(
    e: React.PointerEvent<HTMLButtonElement>,
    action: string
  ) {
    switch (action) {
      case "edit":
        //TODO: modal de editar board
        break;
      case "delete":
        //TODO: modal de deletar board
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    switch (typeActionFocusOpenMenu) {
      case "first": {
        setToFocus(0);
        break;
      }
      case "last": {
        setToFocus(getRefs().length - 1);
        break;
      }
      default:
        break;
    }
  }, [typeActionFocusOpenMenu]);

  useOnClickOutside({ ref: refWrapper, handle: handlePointerDownDropdown });

  return (
    <ul {...rest} className={className ? className : undefined} ref={refList}>
      {datasButtons.map((data, index) => {
        return (
          <li role="none" className="header__menu-item" key={index}>
            <button
              type="button"
              className={`header__btn-board-${data.action}`}
              role="menuitem"
              aria-label={`${data.text} current board`}
              title={`${data.text} current board`}
              ref={(btn) => {
                const refItems = getRefs();
                if (btn) {
                  refItems.push(btn);
                } else {
                  refItems.splice(0, 1);
                }
              }}
              onPointerDown={(e) => {
                handlePointerDownBtnOptionBoard(e, data.action);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e, data.action);
              }}
            >
              {`${data.text} Board`}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
