import React from "react";
import Button from "../Button";
import BoardIcon from "../Icons/Board";
import { useDataContext } from "../context/DataContext";
import { Board } from "../../data";

type PropsListBoards = {
  type: "list" | "menu";
  idElement?: string;
  ariaLabelledby?: string;
  //refsBtnsBoards?: React.RefObject<HTMLButtonElement[] | null>;
  //onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>, board: Board) => void
};

/**
 * * IMPORTANT: este componente pode ser uma lista de boards comun, ou uma menu acessivel
 *
 * @param param0
 * @returns
 */
export default function ListBoards({
  type,
  idElement,
  ariaLabelledby,
  //refsBtnsBoards,
  //onKeyDown
}: PropsListBoards) {
  const dataContext = useDataContext();

  /*function getRefsItemsMenu() {
    if (!refsBtnsBoards.current) {
      throw Error("refs btns board is null");
    }
    return refsBtnsBoards.current;
  }*/

  return (
    //TODO: definir estilos globais deste componente para não precisar ficar reescrevendo css
    <ul
      className="list-boards"
      role={type === "list" ? undefined : "menu"}
      id={type === "menu" && idElement ? idElement : undefined}
      aria-labelledby={
        type === "menu" && ariaLabelledby ? ariaLabelledby : undefined
      }
    >
      {dataContext.datas.map((board, index) => {
        return (
          <li
            className="list-boards__item"
            key={index}
            role={type === "menu" ? "none" : undefined}
          >
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
                if(e.key === "Enter" || e.key === " ") {
                  dataContext.setCurrentSelectedBoard(board);
                }
                //onKeyDown(e, board);
              }}
              role={type === "menu" ? "menuitem" : undefined}
              /*ref={(btn) => {
                const refItems = getRefsItemsMenu();
                if (btn) {
                  refItems[index] = btn;
                } else {
                  refItems.splice(index, 1);
                }
              }}
              */
            >
              <BoardIcon className="list-boards__icon-btn-select-board" />{" "}
              {board.name}
            </Button>
          </li>
        );
      })}
      <li
        className="list-boards__item"
        role={type === "menu" ? "none" : undefined}
      >
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
          role={type === "menu" ? "menuitem" : undefined}
        >
          <BoardIcon className="list-boards__icon-btn-create-board" /> + Create
          New Board
        </Button>
      </li>
    </ul>
  );
}
