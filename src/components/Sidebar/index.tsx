import Button from "../Button";
import Heading from "../Heading";
import HideSidebar from "../Icons/HideSidebar";
import Switch from "../Switch";
import { useDataContext } from "../context/DataContext";
import ShowSidebar from "../Icons/ShowSidebar";
import React, { useEffect, useRef, useState } from "react";
import BoardModal from "../Modals/BoardModal";
import BoardIcon from "../Icons/Board";
import { Board } from "../../data";
import "./Sidebar.css";

/*
interface PropsSidebar extends PropsListBoards {
  isSidebarHidden: boolean;
  onSidebar: (isHidden: boolean) => void;
}

export default function Sidebar(props: PropsSidebar) {
  const { isSidebarHidden, onSidebar } = props;
  const content = useMatchMedia({
    mobileContent: <SidebarMobile {...props} />,
    desktopContent: (
      <SidebarDesktop isSidebarHidden={isSidebarHidden} onSidebar={onSidebar} />
    ),
    mediaQuery: "(min-width: 450px)",
  });
  return content;
}*/

type PropsSidebarDesktop = {
  isSidebarHidden: boolean;
  onSidebar: (isHidden: boolean) => void;
};

export function SidebarDesktop({
  isSidebarHidden,
  onSidebar,
}: PropsSidebarDesktop) {
  const dataContext = useDataContext();
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
        <ListBoards />
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
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSidebar(true);
            }
          }}
        >
          <HideSidebar /> Hide Sidebar
        </Button>
      </div>
    </aside>
  );
}

interface PropsSidebarMobile extends PropsListBoards {
  isSidebarHidden: boolean;
}

export function SidebarMobile(props: PropsSidebarMobile) {
  const { isSidebarHidden } = props;

  if (isSidebarHidden) {
    return null;
  }

  return (
    <div className="backdrop-sidebar">
      <div
        className="sidebar-mobile"
        role="dialog"
        id="dialog-sidebarmobile"
        aria-label="menu boards"
        aria-modal="true"
      >
        <ListBoards {...props} />
        <Switch />
      </div>
    </div>
  );
}

interface PropsListBoards /*extends React.ComponentPropsWithoutRef<"ul">*/ {
  id?: string;
  ariaLabelledyWrapper?: string;
  onCloseWrapper?: () => void;
  typeActionFocusOpenMenu?: "first" | "last";
  className?: string;
}

function ListBoards({
  id,
  ariaLabelledyWrapper,
  onCloseWrapper,
  typeActionFocusOpenMenu,
  className,
}: PropsListBoards) {
  const dataContext = useDataContext();
  const refsItemsMenu = useRef<HTMLButtonElement[] | null>(null);
  const [modalCreateBoardIsOpen, setModalCreateBoardIsOpen] = useState(false);

  useEffect(() => {
    switch (typeActionFocusOpenMenu) {
      case "first":
        setToFocus(0);
        break;
      case "last":
        setToFocus(getRefsItemsMenu().length - 1);
        break;
      default:
        break;
    }
  }, [typeActionFocusOpenMenu]);

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
          //fecha o wrraper via teclado
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
          id={id ? id : undefined}
          aria-labelledby={
            ariaLabelledyWrapper ? ariaLabelledyWrapper : undefined
          }
          className={
            className ? `list-boards__list ${className}` : "list-boards__list"
          }
        >
          {dataContext.datas.map((board, index) => {
            return (
              <li className="list-boards__item" key={index} role="none">
                <Button
                  type="button"
                  size="l"
                  className={
                    board.id === dataContext.currentSelectedBoard.id
                      ? "list-boards__btn--select-board list-boards__btn--select-board-active"
                      : "list-boards__btn--select-board"
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
                  <BoardIcon
                    className={
                      board.id === dataContext.currentSelectedBoard.id
                        ? "list-boards__icon list-boards__icon-btn-select-board list-boards__icon-btn-select-board--active"
                        : "list-boards__icon list-boards__icon-btn-select-board"
                    }
                  />{" "}
                  {board.name}
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
                //TODO: chamar function do state do context data para criar um novo board
                //atualiza state para modal ser renderizado
                setModalCreateBoardIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  //TODO: chamar function do state do context data para criar um novo board
                  //atualiza state para modal ser renderizado
                  setModalCreateBoardIsOpen(true);
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
      <BoardModal
        type="add"
        isOpen={modalCreateBoardIsOpen}
        onHandleOpen={(isOpen: boolean) => setModalCreateBoardIsOpen(isOpen)}
      />
    </>
  );
}
