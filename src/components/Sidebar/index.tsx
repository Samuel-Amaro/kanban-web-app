import Button from "../Button";
import Heading from "../Heading";
import HideSidebar from "../Icons/HideSidebar";
import Switch from "../Switch";
import { useDataContext } from "../../context/DataContext";
import ShowSidebar from "../Icons/ShowSidebar";
import React, { useEffect, useRef, useState } from "react";
import BoardModal from "../Modals/BoardModal";
import BoardIcon from "../Icons/Board";
import { Board } from "../../data";
import "./Sidebar.css";
import {
  getFocusableElements,
  getRefs,
  nextFocusable,
  setFocusNextItem,
  setToFocus,
  setToFocusPreviousItem,
} from "../../utils";
import useNoScroll from "../../hooks/useNoScroll";
import useKeydownWindow from "../../hooks/useKeydownWindow";
import Logo from "../Icons/Logo";
import { Theme } from "../../theme";

type PropsSidebarDesktop = {
  isSidebarHidden: boolean;
  onSidebar: (isHidden: boolean) => void;
  theme: Theme;
};

export function SidebarDesktop({
  isSidebarHidden,
  onSidebar,
  theme,
}: PropsSidebarDesktop) {
  const refBtnToggleSidebar = useRef<HTMLButtonElement>(null);
  const [modalCreateBoardIsOpen, setModalCreateBoardIsOpen] = useState(false);

  function handleCloseSidebar() {
    refBtnToggleSidebar.current?.focus();
    onSidebar(true);
  }

  function handleModalIsOpen(isOppen: boolean) {
    setModalCreateBoardIsOpen(isOppen);
  }

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
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onSidebar(false);
          }
        }}
        ref={refBtnToggleSidebar}
      >
        <ShowSidebar />
      </Button>
    );
  }

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar__logo">
          <Logo theme={theme} className="header__icon-logo-desktop" />
        </div>
        <div className="sidebar__container-primary">
          <div className="sidebar__wrapper">
            <ListBoards
              onCloseWrapper={handleCloseSidebar}
              onModalCreateBoardIsOpen={handleModalIsOpen}
              typeWrapper="desktop"
            />
          </div>
          <div className="sidebar__container-secondary">
            <Switch className="sidebar__swith--margin"/>
            <Button
              type="button"
              size="l"
              variant="secondary"
              title="Hide Sidebar"
              aria-label="Hide Sidebar"
              className="sidebar__btn-hide"
              onPointerDown={() => {
                onSidebar(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSidebar(true);
                }
              }}
            >
              <HideSidebar className="sidebar__icon-btn-hidden"/> Hide Sidebar
            </Button>
          </div>
        </div>
      </aside>
      {modalCreateBoardIsOpen && (
        <BoardModal
          type="add"
          isOpen={modalCreateBoardIsOpen}
          onHandleOpen={(isOpen: boolean) => setModalCreateBoardIsOpen(isOpen)}
        />
      )}
    </>
  );
}

interface PropsSidebarMobile extends PropsListBoards {
  isSidebarHidden?: boolean;
}

export function SidebarMobile(props: PropsSidebarMobile) {
  const { ...rest } = props;
  const refBackdrop = useRef<HTMLDivElement | null>(null);
  const refSideBarMobile = useRef<HTMLDivElement | null>(null);

  function handlePointerDownBackdrop(e: React.PointerEvent<HTMLDivElement>) {
    if (
      refBackdrop.current?.contains(e.target as Node) &&
      (refBackdrop.current as HTMLDivElement) !== e.target
    )
      return;
    if (rest.onCloseWrapper) rest.onCloseWrapper();
  }

  function handleKeyDownDropdown(e: KeyboardEvent) {
    e.stopPropagation();
    switch (e.key) {
      case "Esc":
      case "Escape":
        if (rest.onCloseWrapper) {
          rest.onCloseWrapper();
        }
        break;
      case "Tab": {
        e.preventDefault();
        nextFocusable(
          getFocusableElements(refSideBarMobile.current),
          !e.shiftKey
        );
        break;
      }
      default:
        break;
    }
  }

  useKeydownWindow(handleKeyDownDropdown);

  useNoScroll();

  return (
    <>
      <div
        className="backdrop-sidebar"
        ref={refBackdrop}
        onPointerDown={handlePointerDownBackdrop}
      >
        <div
          className="sidebar-mobile"
          role="dialog"
          id="dialog-sidebarmobile"
          aria-label="menu boards"
          aria-modal="true"
          ref={refSideBarMobile}
        >
          <ListBoards
            {...rest}
            typeWrapper="mobile"
            className="sidebar-mobile__list"
          />
          <Switch />
        </div>
      </div>
    </>
  );
}

interface PropsListBoards extends React.ComponentPropsWithoutRef<"ul"> {
  onCloseWrapper?: () => void;
  typeActionFocusOpenMenu?: "first" | "last";
  typeWrapper?: "mobile" | "desktop";
  onModalCreateBoardIsOpen?: (isOppen: boolean) => void;
}

export function ListBoards(props: PropsListBoards) {
  const {
    onCloseWrapper,
    typeActionFocusOpenMenu,
    typeWrapper,
    className,
    onModalCreateBoardIsOpen,
    ...rest
  } = props;

  const dataContext = useDataContext();
  const selectedBoard = dataContext.datas.find(
    (b) => b.id === dataContext.selectedIdBoard
  );
  const refsItemsMenu = useRef<HTMLButtonElement[] | null>(null);

  useEffect(() => {
    switch (typeActionFocusOpenMenu) {
      case "first":
        setToFocus(0, refsItemsMenu);
        break;
      case "last":
        setToFocus(getRefs(refsItemsMenu).length - 1, refsItemsMenu);
        break;
      default:
        break;
    }
  }, [typeActionFocusOpenMenu]);

  function handleKeyDownBtnBoard(
    e: React.KeyboardEvent<HTMLButtonElement>,
    board: Board
  ) {
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    } else {
      switch (e.key) {
        case "Up":
        case "ArrowUp":
          setToFocusPreviousItem(e.currentTarget, refsItemsMenu);
          break;
        case "ArrowDown":
        case "Down":
          setFocusNextItem(e.currentTarget, refsItemsMenu);
          break;
        case "Home":
        case "PageUp":
          setToFocus(0, refsItemsMenu);
          break;
        case "End":
        case "PageDown":
          setToFocus(getRefs(refsItemsMenu).length - 1, refsItemsMenu);
          break;
        case "Enter":
        case " ":
          dataContext.updateIdSelectedBoard(board.id);
          break;
        default:
          break;
      }
    }
  }

  return (
    <>
      <div
        className={
          className
            ? `list-boards-container ${className}`
            : "list-boards-container"
        }
      >
        <Heading level={4} className="list-boards__title">
          ALL BOARDS ({dataContext.datas.length})
        </Heading>
        <ul
          {...rest}
          className={
            className ? `list-boards__list ${className}` : "list-boards__list"
          }
          aria-live="polite"
          aria-atomic="true"
        >
          {dataContext.datas.map((board, index) => {
            return (
              <li className="list-boards__item" key={index} role="none">
                <Button
                  type="button"
                  size="l"
                  className={
                    board.id === selectedBoard?.id
                      ? "list-boards__btn--select-board list-boards__btn--select-board-active"
                      : "list-boards__btn--select-board"
                  }
                  aria-label={`Select ${board.name} board`}
                  title={`Select ${board.name} board`}
                  onPointerDown={() => {
                    dataContext.updateIdSelectedBoard(board.id);
                  }}
                  onKeyDown={(e) => {
                    handleKeyDownBtnBoard(e, board);
                  }}
                  role="menuitem"
                  ref={(btn) => {
                    const refItems = getRefs(refsItemsMenu);
                    if (btn) {
                      refItems[index] = btn;
                    } else {
                      refItems.splice(index, 1);
                    }
                  }}
                >
                  <BoardIcon
                    className={
                      board.id === selectedBoard?.id
                        ? "list-boards__icon list-boards__icon-btn-select-board list-boards__icon-btn-select-board--active"
                        : "list-boards__icon list-boards__icon-btn-select-board"
                    }
                  />
                  <span className="list-boards__btn--text">{board.name}</span>
                </Button>
              </li>
            );
          })}
          <li className="list-boards__item" role="none">
            <Button
              type="button"
              size="l"
              className="list-boards__btn--create-board"
              aria-label="create new board"
              title={`create new board`}
              onPointerDown={() => {
                if (
                  typeWrapper === "mobile" &&
                  onCloseWrapper &&
                  onModalCreateBoardIsOpen
                ) {
                  onCloseWrapper();
                  onModalCreateBoardIsOpen(true);
                  return;
                }
                onModalCreateBoardIsOpen && onModalCreateBoardIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (
                    typeWrapper === "mobile" &&
                    onCloseWrapper &&
                    onModalCreateBoardIsOpen
                  ) {
                    onCloseWrapper();
                    onModalCreateBoardIsOpen(true);
                    return;
                  }
                  onModalCreateBoardIsOpen && onModalCreateBoardIsOpen(true);
                }
              }}
              role="menuitem"
            >
              <BoardIcon className="list-boards__icon list-boards__icon-btn-create-board" />{" "}
              + Create New Board
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
}
