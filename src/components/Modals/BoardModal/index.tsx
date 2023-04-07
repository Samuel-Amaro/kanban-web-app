import React, { useEffect, useReducer, useRef, useState } from "react";
import Heading from "../../Heading";
import CrossIcon from "../../Icons/Cross";
import { Board, Column } from "../../../data";
import { nanoid } from "nanoid";
import Button from "../../Button";
import { createPortal, flushSync } from "react-dom";
import { boardReducer } from "../../../reducers/boardReducer";
import BackdropModal from "../../BackdropModal";
import "./BoardModal.css";
import {
  DataError,
  getFocusableElements,
  nextFocusable,
  validationForm,
} from "../../../utils";

type PropsBoardModal = {
  type: "add" | "edit";
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  initialData?: Board | null;
};

//TODO: validar form do modal antes de salvar o board no context

export default function BoardModal({
  type,
  isOpen,
  onHandleOpen,
  initialData,
}: PropsBoardModal) {
  const refInputNameBoard = useRef<HTMLInputElement | null>(null);
  const refDialog = useRef<HTMLDivElement | null>(null);
  const refsInputColumns = useRef<Map<number, HTMLInputElement> | null>(null);
  const [errors, setErrors] = useState<DataError>({ columns: [] });

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

  function getMap() {
    if (!refsInputColumns.current) {
      refsInputColumns.current = new Map();
    }
    return refsInputColumns.current;
  }

  function focusToId(itemId: number) {
    const map = getMap();
    const node = map.get(itemId);
    node?.focus();
  }

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
    if (!e) dispatch({ type: "removed_column", idColumn: column.id });
  }

  function handlePointerOrKeyDownBtnAddNewColumn(
    e: React.KeyboardEvent<HTMLButtonElement> | undefined
  ) {
    if (e) {
      if (e.key === "Enter" || e.key === " ") {
        flushSync(() => {
          dispatch({ type: "add_new_column" });
        });
        focusToId(board.columns.length - 1);
        return;
      }
    }
    if (!e) dispatch({ type: "add_new_column" });
  }

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(validationForm(board));
    setErrors(validationForm(board));
  }

  function handleKeyDownDialog(e: KeyboardEvent) {
    switch (e.key) {
      case "Esc":
      case "Escape":
        onHandleOpen(false);
        break;
      case "Tab": {
        e.preventDefault();
        nextFocusable(getFocusableElements(refDialog.current), !e.shiftKey);
        break;
      }
      default:
        break;
    }
  }

  useEffect(() => {
    //ao abrir modal foca primeiro campo
    refInputNameBoard.current?.focus();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownDialog);

    return () => {
      window.removeEventListener("keydown", handleKeyDownDialog);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  const template = (
    <BackdropModal
      onHandleOpenModal={() => {
        onHandleOpen(false);
      }}
    >
      <div
        className="dialog"
        role="dialog"
        id="dialog-add-board"
        aria-labelledby="dialog-label"
        aria-modal="true"
        ref={refDialog}
      >
        <Heading level={2} className="dialog__title" id="dialog-label">
          {type === "add" ? "Add New Board" : "Edit Board"}
        </Heading>
        <form className="dialog__form" onSubmit={handleSubmitForm}>
          <div className="dialog__form-group">
            <label htmlFor="board-name" className="dialog__label">
              Board Name
            </label>
            {errors["nameBoard"] ? (
              <div className="dialog__form-group-error">
                <input
                  type="text"
                  name="board-name"
                  id="board-name"
                  placeholder="e.g Web Design"
                  className="dialog__input"
                  title="Board Name"
                  value={board.name}
                  onChange={handleChangedNameBoard}
                  ref={refInputNameBoard}
                />
                <span className="dialog__error-input" aria-live="polite">
                  {`${errors["nameBoard"]}`}
                </span>
              </div>
            ) : (
              <input
                type="text"
                name="board-name"
                id="board-name"
                placeholder="e.g Web Design"
                className="dialog__input"
                title="Board Name"
                value={board.name}
                onChange={handleChangedNameBoard}
                ref={refInputNameBoard}
              />
            )}
          </div>
          <div className="dialog__form-group">
            <label htmlFor="board-columns" className="dialog__label">
              Board Columns
            </label>
            <div className="dialog__form-columns">
              {board.columns.map((column, index) => {
                //TODO: filter pelo id para ver que esta com error, qual column esta com error
                //TODO: arrumar aqui, escolher uma forma de mostrar as mensagens de validações para os campos de name de columns invalidas
                return (
                  <div className="dialog__container-column" key={index}>
                    {errors["columns"].length > 0 ? (
                      errors["columns"].filter((def) => def.id === column.id)
                        .length > 0 && (
                        <div className="dialog__form-group-errors">
                          <input
                            type="text"
                            name={`column-${index}`}
                            aria-label="enter with name column"
                            className="dialog__input"
                            title="name column Board"
                            value={column.name}
                            onChange={(e) => {
                              handleChangedNameColumn(e, column);
                            }}
                            ref={(node) => {
                              const map = getMap();
                              if (node) {
                                map.set(index, node);
                              } else {
                                map.delete(index);
                              }
                            }}
                          />
                          <span
                            className="dialog__error-input"
                            aria-live="polite"
                          >
                            {`${
                              errors.columns.filter(
                                (def) => def.id === column.id
                              )[0].error
                            }`}
                          </span>
                        </div>
                      )
                    ) : (
                      <input
                        type="text"
                        name={`column-${index}`}
                        aria-label="enter with name column"
                        className="dialog__input"
                        title="name column Board"
                        value={column.name}
                        onChange={(e) => {
                          handleChangedNameColumn(e, column);
                        }}
                        ref={(node) => {
                          const map = getMap();
                          if (node) {
                            map.set(index, node);
                          } else {
                            map.delete(index);
                          }
                        }}
                      />
                    )}
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
    </BackdropModal>
  );

  return createPortal(template, document.body);
}
