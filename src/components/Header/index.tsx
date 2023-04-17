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
import {
  getFocusableElements,
  getRefs,
  nextFocusable,
  setFocusNextItem,
  setToFocus,
  setToFocusPreviousItem,
} from "../../utils";
import DeleteModal from "../Modals/Delete";

type PropsSidebar = {
  isSidebarHidden: boolean;
  onSidebar: (isHidden: boolean) => void;
};

export default function Header({ isSidebarHidden, onSidebar }: PropsSidebar) {
  const dataContext = useDataContext();
  const selectedBoard = dataContext.datas.find(
    (b) => b.id === dataContext.selectedIdBoard
  );

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
          disabled={
            selectedBoard
              ? selectedBoard.columns.length > 0
                ? false
                : true
              : true
          }
        >
          <span className="header__text-btn-add-task">+ Add New Task</span>
          <img
            src={iconTaskMobile}
            alt=""
            aria-hidden="true"
            className="header__icon-btn-add-task"
          />
        </Button>
        {/*//TODO:  so mostrar options de editar quadro se possuir um quadro selecionado*/}
        {selectedBoard && <MenuButtonBoard />}
      </div>
    </header>
  );
}

function DesktopContent() {
  const dataContext = useDataContext();
  const themeContext = useThemeContext();
  const selectedBoard = dataContext.datas.find(
    (b) => b.id === dataContext.selectedIdBoard
  );

  return (
    <div className="header__group">
      <div className="header__logo">
        <Logo
          theme={themeContext.theme}
          className="header__icon-logo-desktop"
        />
      </div>
      <Heading level={1} className="header__name-board" aria-live="polite" aria-atomic="true">
        {selectedBoard ? selectedBoard.name : "Select a board"}
      </Heading>
    </div>
  );
}

//interface PropsMenuButtonSidebar extends PropsSidebar {}

function MenuButtonSidebarMobile({ isSidebarHidden, onSidebar }: PropsSidebar) {
  const dataContext = useDataContext();
  const selectedBoard = dataContext.datas.find(
    (b) => b.id === dataContext.selectedIdBoard
  );
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
        <Heading
          level={2}
          className="header__name-board"
          aria-live="polite"
          aria-atomic="true"
        >
          {selectedBoard ? selectedBoard.name : "Select a board"}
        </Heading>
        {isSidebarHidden ? (
          <ChevronDown className="header__icon header__icon--chevron-down" />
        ) : (
          <ChevronUp className="header__icon header__icon--chevron-up" />
        )}
      </div>
      {!isSidebarHidden && (
        <SidebarMobile
          id="menu-sidebar"
          aria-labelledby="menubutton-sidebar"
          onCloseWrapper={handleCloseSidebar}
          typeActionFocusOpenMenu={typeActionFocus}
          onModalCreateBoardIsOpen={(isOpen: boolean) =>
            setModalCreateBoardIsOpen(isOpen)
          }
        />
      )}
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

type DataActionButton = "edit" | "delete";
type DataButton = {
  text: string;
  action: DataActionButton;
};

function MenuButtonBoard() {
  const dataContext = useDataContext();
  const selectedBoard = dataContext.datas.find(
    (b) => b.id === dataContext.selectedIdBoard
  );
  const [isHiddenMenuBoard, setIsHiddenMenuBoard] = useState(true);
  const [modalEditBoardIsOpen, setModalEditBoardIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
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

  return (
    <>
      <div className="header__menu-button-board" ref={refBtnDropdow}>
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
            handleModalEditBoardIsOppen={(isOppen: boolean) =>
              setModalEditBoardIsOpen(isOppen)
            }
            handleModalDeleteIsOppen={(isOppen: boolean) =>
              setModalDeleteIsOpen(isOppen)
            }
          />
        )}
      </div>
      {/*//TODO: SE NÃO TIVER O STATE DO MODAL PERMITIDO PARA ABRIR E NÃO TIVER BOARD SELECTED, MOSTRAR UM MODAL DE ERROR INFORMANDO PORQUE NÃO ABRIU, O MODAL DE EDITAR OU DELETAR BOARD*/}
      {modalEditBoardIsOpen && selectedBoard && (
        <BoardModal
          type="edit"
          isOpen={modalEditBoardIsOpen}
          onHandleOpen={(isOppen: boolean) => {
            handleOnCloseWrapper();
            setModalEditBoardIsOpen(isOppen);
          }}
          initialData={selectedBoard}
        />
      )}
      {modalDeleteIsOpen && selectedBoard && (
        <DeleteModal
          typeDelete="board"
          isOpen={modalDeleteIsOpen}
          onHandleOpen={(isOppen: boolean) => {
            handleOnCloseWrapper();
            setModalDeleteIsOpen(isOppen);
          }}
          title_or_name={selectedBoard.name}
          id={selectedBoard.id}
        />
      )}
    </>
  );
}

interface PropsListButtonsMenuBoard
  extends React.ComponentPropsWithoutRef<"ul"> {
  onCloseWrapper?: () => void;
  datasButtons: DataButton[];
  typeActionFocusOpenMenu?: "first" | "last";
  onMenuBoardHidden?: (isHidden: boolean) => void;
  refWrapper: React.MutableRefObject<HTMLElement | null>;
  handleModalEditBoardIsOppen?: (isOppen: boolean) => void;
  handleModalDeleteIsOppen?: (isOppen: boolean) => void;
}

function ListButtonsMenuBoard(props: PropsListButtonsMenuBoard) {
  const {
    className,
    datasButtons,
    onCloseWrapper,
    typeActionFocusOpenMenu,
    onMenuBoardHidden,
    refWrapper,
    handleModalEditBoardIsOppen,
    handleModalDeleteIsOppen,
    ...rest
  } = props;
  const refsButtons = useRef<HTMLButtonElement[] | null>(null);
  const refList = useRef<HTMLUListElement | null>(null);

  function handlePointerDownDropdown() {
    if (onMenuBoardHidden) onMenuBoardHidden(true);
  }

  function handleKeyDownBtnOptionBoard(
    e: React.KeyboardEvent<HTMLButtonElement>,
    action: DataActionButton
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
          setToFocusPreviousItem(e.currentTarget, refsButtons);
          break;
        case "ArrowDown":
        case "Down":
          setFocusNextItem(e.currentTarget, refsButtons);
          break;
        case "Home":
        case "PageUp":
          setToFocus(0, refsButtons);
          break;
        case "End":
        case "PageDown":
          setToFocus(getRefs(refsButtons).length - 1, refsButtons);
          break;
        case "Tab":
          e.preventDefault();
          nextFocusable(getFocusableElements(refList.current), !e.shiftKey);
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          if (
            action === "edit" &&
            handleModalEditBoardIsOppen &&
            onMenuBoardHidden
          ) {
            onMenuBoardHidden(true);
            handleModalEditBoardIsOppen(true);
            return;
          }
          if (
            action === "delete" &&
            handleModalDeleteIsOppen &&
            onMenuBoardHidden
          ) {
            onMenuBoardHidden(true);
            handleModalDeleteIsOppen(true);
            return;
          }
          break;
        default:
          break;
      }
    }
  }

  function handlePointerDownBtnOptionBoard(
    e: React.PointerEvent<HTMLButtonElement>,
    action: DataActionButton
  ) {
    switch (action) {
      case "edit":
        if (handleModalEditBoardIsOppen) {
          if (onMenuBoardHidden) onMenuBoardHidden(true);
          handleModalEditBoardIsOppen(true);
        }
        break;
      case "delete":
        if (handleModalDeleteIsOppen) {
          if (onMenuBoardHidden) onMenuBoardHidden(true);
          handleModalDeleteIsOppen(true);
        }
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    switch (typeActionFocusOpenMenu) {
      case "first": {
        setToFocus(0, refsButtons);
        break;
      }
      case "last": {
        setToFocus(getRefs(refsButtons).length - 1, refsButtons);
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
                const refItems = getRefs(refsButtons);
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
                handleKeyDownBtnOptionBoard(e, data.action);
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
