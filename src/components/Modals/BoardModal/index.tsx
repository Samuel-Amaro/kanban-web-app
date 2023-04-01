import { useState } from "react";
import Heading from "../../Heading";
import CrossIcon from "../../Icons/Cross";
import "./BoardModal.css";
import { Board, Column } from "../../../data";
import { nanoid } from "nanoid";
import Button from "../../Button";
import { createPortal } from "react-dom";

type PropsBoardModal = {
  type: "add" | "edit";
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  initialData?: Board | null;
};

//TODO: criar modal que permita criação e edição de boars
//TODO: criar logica de estado e validação de formulario
//TODO: tudo no mesmo modal componente
//TODO: como temos varios manipuladores de eventos vamos criar um reducers para centralizar a logica de atualização de estado para este modal

export default function BoardModal({
  type,
  isOpen,
  onHandleOpen,
  initialData,
}: PropsBoardModal) {
  const defaultColumns = [
    { id: `column-${nanoid(5)}`, name: "Todo", tasks: [] },
    { id: `column-${nanoid(5)}`, name: "Doing", tasks: [] },
  ];

  const [board, setBoard] = useState<Board>(
    initialData
      ? initialData
      : {
          id: `board-${nanoid(5)}`,
          name: "",
          columns: defaultColumns,
        }
  );

  function handleChangedNameBoard(e: React.ChangeEvent<HTMLInputElement>) {
    setBoard({
      ...board,
      name: e.target.value,
    });
  }

  function handleChangedNameColumn(
    e: React.ChangeEvent<HTMLInputElement>,
    column: Column
  ) {
    setBoard({
      ...board,
      columns: board.columns.map((c) => {
        if (c.id === column.id) {
          return {
            ...c,
            name: e.target.value,
          };
        }
        return c;
      }),
    });
  }

  function handlePointerOrKeyDownBtnRemoveColumn(
    e: React.KeyboardEvent<HTMLButtonElement> | undefined,
    column: Column
  ) {
    if (e) {
      if (e.key === "Enter" || e.key === " ") {
        setBoard({
          ...board,
          columns: board.columns.filter((c) => c.id !== column.id),
        });
        return;
      }
    }
    setBoard({
      ...board,
      columns: board.columns.filter((c) => c.id !== column.id),
    });
  }

  function handlePointerOrKeyDownBtnAddNewColumn(
    e: React.KeyboardEvent<HTMLButtonElement> | undefined
  ) {
    if (e) {
      if (e.key === "Enter" || e.key === " ") {
        setBoard({
          ...board,
          columns: [
            ...board.columns,
            { id: `column-${nanoid(5)}`, name: "", tasks: [] },
          ],
        });
        return;
      }
    }
    setBoard({
      ...board,
      columns: [
        ...board.columns,
        { id: `column-${nanoid(5)}`, name: "", tasks: [] },
      ],
    });
  }

  if (!isOpen) {
    return null;
  }

  const template = (
    <div className="backdrop-modal">
      <div
        className="dialog"
        role="dialog"
        id="dialog-add-board"
        aria-labelledby="dialog-label"
        aria-modal="true"
      >
        <Heading level={2} className="dialog__label" id="dialog-label">
          {type === "add" ? "Add New Board" : "Edit Board"}
        </Heading>
        <form className="dialog__form" name="add-board">
          <div className="dialog__form-group">
            <label htmlFor="board-name" className="dialog__label">
              Board Name
            </label>
            <input
              type="text"
              name="board-name"
              id="board-name"
              placeholder="e.g Web Design"
              className="dialog__input"
              title="Board Name"
              value={board.name}
              onChange={handleChangedNameBoard}
            />
          </div>
          <div className="dialog__form-group">
            <label
              htmlFor="board-columns"
              className="dialog__label"
              id="board-columns"
            >
              Board Columns
            </label>
            <div className="dialog__form-columns">
              {board.columns.map((column) => {
                return (
                  <div className="dialog__container-column" key={column.id}>
                    <input
                      type="text"
                      name={`column-${column.name
                        .toLowerCase()
                        .split(" ")
                        .join("")}`}
                      aria-labelledby="board-columns"
                      className="dialog__input"
                      title="name column Board"
                      value={column.name}
                      onChange={(e) => {
                        handleChangedNameColumn(e, column);
                      }}
                    />
                    <button
                      type="button"
                      title="Remove Column Board"
                      className="dialog__btn-remove-column"
                      aria-label="Remove Column Board"
                      onPointerDown={() => {
                        handlePointerOrKeyDownBtnRemoveColumn(
                          undefined,
                          column
                        );
                      }}
                      onKeyDown={(e) => {
                        handlePointerOrKeyDownBtnRemoveColumn(e, column);
                      }}
                    >
                      <CrossIcon className="dialog__icon-btn" />
                    </button>
                  </div>
                );
              })}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="s"
              title="Add New Column"
              aria-label="Add New Column"
              onPointerDown={() => {
                handlePointerOrKeyDownBtnAddNewColumn(undefined);
              }}
              onKeyDown={(e) => {
                handlePointerOrKeyDownBtnAddNewColumn(e);
              }}
            >
              + Add new Column
            </Button>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="s"
            title={type === "add" ? "Create New Board" : "Save Changes"}
            aria-label={type === "add" ? "Create New Board" : "Save Changes"}
          >
            {type === "add" ? "Create New Board" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );

  return createPortal(template, document.body);
}
