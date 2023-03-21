import { useState } from "react";
import Heading from "../../Heading";
import CrossIcon from "../../Icons/Cross";
import "./BoardModal.css";
import { Board, Column } from "../../../data";
import { nanoid } from "nanoid";
import Button from "../../Button";

type PropsBoardModal = {
  type: "add" | "edit";
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  initialData?: Board | null;
};

//TODO: criar modal que permita criação e edição de boars
//TODO: criar logica de estado e validação de formulario
//TODO: tudo no mesmo modal componente

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
  const [columnsBoard, setColumnsBoard] = useState<Column[]>(
    initialData ? initialData.columns : defaultColumns
  );
  const [board, setBoard] = useState<Board>(
    initialData
      ? initialData
      : { id: `board-${nanoid(5)}`, name: "", columns: columnsBoard }
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="backdrop-modal">
      <div
        className="dialog dialog__add-board"
        role="dialog"
        id="dialog-add-board"
        aria-labelledby="dialog-label"
        aria-modal="true"
      >
        <Heading level={2} className="dialog__label" id="dialog-label">
          Add New Board
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
            />
          </div>
          <div className="dialog__form-group">
            <label htmlFor="board-columns" className="dialog__label">
              Board Columns
            </label>
            <div className="dialog__form-columns">
              {columnsBoard.map((column) => {
                return (
                  <div className="dialog__container-column" key={column.id}>
                    <input
                      type="text"
                      name={`column-${column.name
                        .toLowerCase()
                        .split(" ")
                        .join("")}`}
                      id="board-columns"
                      className="dialog__input"
                      title="Name to column Board"
                    />
                    <button
                      type="button"
                      title="Remove Column Board"
                      className="dialog__btn-remove-column"
                      aria-label="Remove Column Board"
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
}
