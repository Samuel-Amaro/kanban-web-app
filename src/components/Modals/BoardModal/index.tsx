import { useReducer } from "react";
import Heading from "../../Heading";
import CrossIcon from "../../Icons/Cross";
import "./BoardModal.css";
import { Board, Column } from "../../../data";
import { nanoid } from "nanoid";
import Button from "../../Button";
import { createPortal } from "react-dom";
import { boardReducer } from "../../../reducers/boardReducer";

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

  const [board, dispatch] = useReducer(
    boardReducer,
    initialData
      ? initialData
      : {
          id: `board-${nanoid(5)}`,
          name: "",
          columns: defaultColumns,
        }
  );

  function handleChangedNameBoard(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "changed_name_board", newNameBoard: e.target.value });
  }

  function handleChangedNameColumn(
    e: React.ChangeEvent<HTMLInputElement>,
    column: Column
  ) {
    dispatch({
      type: "changed_name_column",
      idColumn: column.id,
      newNameColumn: e.target.value,
    });
  }

  function handlePointerOrKeyDownBtnRemoveColumn(
    e: React.KeyboardEvent<HTMLButtonElement> | undefined,
    column: Column
  ) {
    if (e) {
      if (e.key === "Enter" || e.key === " ") {
        dispatch({ type: "removed_column", idColumn: column.id });
        return;
      }
    }
    dispatch({ type: "removed_column", idColumn: column.id });
  }

  function handlePointerOrKeyDownBtnAddNewColumn(
    e: React.KeyboardEvent<HTMLButtonElement> | undefined
  ) {
    if (e) {
      if (e.key === "Enter" || e.key === " ") {
        dispatch({ type: "add_new_column" });
        return;
      }
    }
    dispatch({ type: "add_new_column" });
  }

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        <Heading level={2} className="dialog__title" id="dialog-label">
          {type === "add" ? "Add New Board" : "Edit Board"}
        </Heading>
        <form
          className="dialog__form"
          name="add-board"
          onSubmit={handleSubmitForm}
        >
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
              className="dialog__btn-add-column"
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
            className="dialog__btn-submit-form"
          >
            {type === "add" ? "Create New Board" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );

  return createPortal(template, document.body);
}
