import Button from "../Button";
import Heading from "../Heading";
import ChevronDown from "../Icons/ChevronDown";
import LogoMobile from "../Icons/LogoMobile";
import { useThemeContext } from "../../context/ThemeContext";
import Logo from "../Icons/Logo";
import ChevronUp from "../Icons/ChevronUp";
import React, { useRef, useState } from "react";
import iconTaskMobile from "../../assets/images/icon-add-task-mobile.svg";
import useMatchMedia from "../../hooks/useMatchMedia";
import { SidebarMobile } from "../Sidebar";
import "./Header.css";
import BoardModal from "../Modals/BoardModal";
import DeleteModal from "../Modals/Delete";
import Dropdown from "../DropdownMenu";
import ModalTask from "../Modals/Task";
import { Board } from "../../data";

type PropsSidebar = {
  isSidebarHidden: boolean;
  onSidebar: (isHidden: boolean) => void;
  selectedBoard: Board | undefined;
};

export default function Header({
  isSidebarHidden,
  onSidebar,
  selectedBoard,
}: PropsSidebar) {
  const refBtnDropdown = useRef<HTMLButtonElement | null>(null);
  const refBtnAddTask = useRef<HTMLButtonElement | null>(null);
  const optionsDropdown = [
    { value: "edit", label: "Edit Board" },
    { value: "delete", label: "Delete Board" },
  ];
  const [modalEditBoardIsOppen, setModalEditBoardIsOpen] = useState(false);
  const [modalDeleteBoardIsOppen, setModalDeleteBoardIsOppen] = useState(false);
  const [modalTaskIsOppen, setModalTaskIsOppen] = useState(false);

  function handleChangeDropdownOption(value: string) {
    if (value === "edit") {
      setModalEditBoardIsOpen(true);
    }
    if (value === "delete") {
      setModalDeleteBoardIsOppen(true);
    }
  }

  function handlePointerDownBtnAddTask() {
    setModalTaskIsOppen(true);
  }

  function handleKeydownBtnAddTask(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case "Enter":
      case " ": {
        e.preventDefault();
        setModalTaskIsOppen(true);
        break;
      }
      default:
        break;
    }
  }

  return (
    <>
      <header className="header">
        {useMatchMedia({
          mobileContent: (
            <MenuButtonSidebarMobile
              isSidebarHidden={isSidebarHidden}
              onSidebar={onSidebar}
              nameBoard={selectedBoard?.name}
            />
          ),
          desktopContent: (
            <DesktopContent
              nameBoard={selectedBoard?.name}
              isSidebarHidden={isSidebarHidden}
            />
          ),
          mediaQuery: "(min-width: 690px)",
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
            onPointerDown={handlePointerDownBtnAddTask}
            onKeyDown={(e) => handleKeydownBtnAddTask(e)}
            ref={refBtnAddTask}
          >
            <span className="header__text-btn-add-task">+ Add New Task</span>
            <img
              src={iconTaskMobile}
              alt=""
              aria-hidden="true"
              className="header__icon-btn-add-task"
            />
          </Button>
          {selectedBoard && (
            <Dropdown
              options={optionsDropdown}
              onChange={handleChangeDropdownOption}
              ref={refBtnDropdown}
            />
          )}
        </div>
      </header>
      {modalEditBoardIsOppen && selectedBoard && (
        <BoardModal
          type="edit"
          isOpen={modalEditBoardIsOppen}
          onHandleOpen={(isOppen: boolean) => {
            refBtnDropdown.current?.focus();
            setModalEditBoardIsOpen(isOppen);
          }}
          initialData={selectedBoard}
        />
      )}
      {modalDeleteBoardIsOppen && selectedBoard && (
        <DeleteModal<"board">
          isOpen={modalDeleteBoardIsOppen}
          onHandleOpen={(isOppen: boolean) => {
            refBtnDropdown.current?.focus();
            setModalDeleteBoardIsOppen(isOppen);
          }}
          nameBoard={selectedBoard.name}
          idBoard={selectedBoard.id}
          typeDelete={"board"}
        />
      )}
      {modalTaskIsOppen && selectedBoard && (
        <ModalTask
          type="add"
          isOpen={modalTaskIsOppen}
          onHandleOpen={(isOppen: boolean) => {
            refBtnAddTask.current?.focus();
            setModalTaskIsOppen(isOppen);
          }}
          selectedBoard={selectedBoard}
        />
      )}
    </>
  );
}

type PropsDesktopContext = {
  nameBoard: string | undefined;
  isSidebarHidden: boolean;
};

function DesktopContent({ nameBoard, isSidebarHidden }: PropsDesktopContext) {
  const themeContext = useThemeContext();

  return (
    <div className="header__group">
      <div
        className={
          isSidebarHidden ? "header__logo header__logo--line" : "header__logo"
        }
      >
        <Logo
          theme={themeContext.theme}
          className="header__icon-logo-desktop"
        />
      </div>
      <Heading
        level={1}
        className="header__name-board"
        aria-live="polite"
        aria-atomic="true"
      >
        {nameBoard ? nameBoard : "Select a board"}
      </Heading>
    </div>
  );
}

interface PropsMenuButtonSidebarMobile {
  isSidebarHidden: boolean;
  onSidebar: (isHidden: boolean) => void;
  nameBoard: string | undefined;
}

function MenuButtonSidebarMobile({
  isSidebarHidden,
  onSidebar,
  nameBoard,
}: PropsMenuButtonSidebarMobile) {
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
          {nameBoard ? nameBoard : "Select a board"}
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
