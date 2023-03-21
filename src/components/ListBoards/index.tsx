import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import BoardIcon from "../Icons/Board";
import { useDataContext } from "../context/DataContext";
import { Board } from "../../data";
import "./ListBoards.css";
import Heading from "../Heading";
import BoardModal from "../Modals/BoardModal";

interface PropsListBoards extends React.ComponentPropsWithoutRef<"ul"> {
  onCloseWrapper: () => void;
  setIdItemToFocus?: number;
}

export default function ListBoards(props: PropsListBoards) {
  const { onCloseWrapper, setIdItemToFocus, className } = props;
  const dataContext = useDataContext();
  const refsItemsMenu = useRef<HTMLButtonElement[] | null>(null);
  const [modalCreateBoardIsOpen, setModalCreateBoardIsOpen] = useState(false);

  useEffect(() => {
    if (typeof setIdItemToFocus === "number") {
      setToFocus(setIdItemToFocus);
    }
  });

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
          onCloseWrapper();
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
        <ul {...props} className="list-boards__list">
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
