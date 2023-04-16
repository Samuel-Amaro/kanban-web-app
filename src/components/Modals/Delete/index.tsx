import { createPortal } from "react-dom";
import BackdropModal from "../../BackdropModal";
import Heading from "../../Heading";
import Button from "../../Button";
import "./DeleteModal.css";
import { useEffect, useRef } from "react";
import {
  getFocusableElements,
  getRefs,
  nextFocusable,
  setFocusNextItem,
  setToFocus,
  setToFocusPreviousItem,
} from "../../../utils";
import {
  /*useDataContext,*/ useDatasDispatch,
} from "../../../context/DataContext";

type PropsDeleteModal = {
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  typeDelete: "board" | "task";
  title_or_name: string;
  id: string;
};

export default function DeleteModal({
  isOpen,
  onHandleOpen,
  typeDelete,
  title_or_name,
  id,
}: PropsDeleteModal) {
  const refDialog = useRef<HTMLDivElement | null>(null);
  const refBtns = useRef<HTMLButtonElement[] | null>(null);

  const dispatchDatasContext = useDatasDispatch();

  function handleKeyDownDialog(e: KeyboardEvent) {
    e.stopPropagation();
    switch (e.key) {
      case "Esc":
      case "Escape":
        onHandleOpen(false);
        break;
      default:
        break;
    }
  }

  function handlePointerDownBtnDelete(/*e: React.PointerEvent<HTMLButtonElement>*/) {
    if (typeDelete === "board") {
      dispatchDatasContext({
        type: "delete_board",
        idBoard: id,
      });
    }
    if (typeDelete === "task") {
      //TODO: IMPLEMENTAR LOGICA PARA CHAMAR DISPATCH DATAS CONTEXT PARA EXCLUIR UMA TASK, IMPLEMENTAR CASE NO REDUCER DATAS REDUCER
    }
    onHandleOpen(false);
  }

  function handleKeyDownBtnDelete(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case "Enter":
      case " ":
        if (typeDelete === "board") {
          dispatchDatasContext({
            type: "delete_board",
            idBoard: id,
          });
        }
        if (typeDelete === "task") {
          //TODO: IMPLEMENTAR LOGICA PARA CHAMAR DISPATCH DATAS CONTEXT PARA EXCLUIR UMA TASK, IMPLEMENTAR CASE NO REDUCER DATAS REDUCER
        }
        onHandleOpen(false);
        break;
      case "Up":
      case "ArrowUp":
        setToFocusPreviousItem(e.currentTarget, refBtns);
        break;
      case "ArrowDown":
      case "Down":
        setFocusNextItem(e.currentTarget, refBtns);
        break;
      case "Home":
      case "PageUp":
        setToFocus(0, refBtns);
        break;
      case "End":
      case "PageDown":
        setToFocus(getRefs(refBtns).length - 1, refBtns);
        break;
      case "Tab":
        e.preventDefault();
        nextFocusable(getFocusableElements(refDialog.current), !e.shiftKey);
        break;
      default:
        break;
    }
  }

  function handlePointerDownBtnCancel() {
    onHandleOpen(false);
  }

  function handleKeyDownBtnCancel(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case "Enter":
      case " ":
        onHandleOpen(false);
        break;
      case "Up":
      case "ArrowUp":
        setToFocusPreviousItem(e.currentTarget, refBtns);
        break;
      case "ArrowDown":
      case "Down":
        setFocusNextItem(e.currentTarget, refBtns);
        break;
      case "Home":
      case "PageUp":
        setToFocus(0, refBtns);
        break;
      case "End":
      case "PageDown":
        setToFocus(getRefs(refBtns).length - 1, refBtns);
        break;
      case "Tab":
        e.preventDefault();
        nextFocusable(getFocusableElements(refDialog.current), !e.shiftKey);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    //ao abrir modal foca no btn delete
    if (refBtns.current) refBtns.current[0].focus();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownDialog);

    return () => {
      window.removeEventListener("keydown", handleKeyDownDialog);
    };
  }, []);

  useEffect(() => {
    document.body.classList.add("has-dialog");

    return () => {
      document.body.classList.remove("has-dialog");
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  const messageDeleteBoard = `Are you sure you want to delete the ‘${title_or_name}’ board? This action will remove all columns and tasks and cannot be reversed.`;

  const messageDeleteTask = `Are you sure you want to delete the ‘${title_or_name}’ task and its subtasks? This action cannot be reversed.`;

  const template = (
    <BackdropModal onHandleOpenModal={() => onHandleOpen(false)}>
      <div
        className="dialog-delete"
        role="dialog"
        id="dialog-delete"
        aria-labelledby="dialog-label-title"
        aria-modal="true"
        ref={refDialog}
      >
        <Heading
          level={2}
          className="dialog-delete__title"
          id="dialog-label-title"
        >
          {`Delete this ${typeDelete === "board" ? "board" : "task"}?`}
        </Heading>
        <p className="dialog-delete__message">
          {typeDelete === "board" ? messageDeleteBoard : messageDeleteTask}
        </p>
        <div className="dialog-delete__buttons">
          <Button
            type="button"
            variant="destructive"
            size="s"
            title={`Delete ${typeDelete === "board" ? "board" : "task"}?`}
            aria-label={`Delete ${typeDelete === "board" ? "board" : "task"}?`}
            className="dialog-delete__btn-delete"
            onPointerDown={handlePointerDownBtnDelete}
            onKeyDown={(e) => {
              handleKeyDownBtnDelete(e);
            }}
            ref={(btn) => {
              const refItems = getRefs(refBtns);
              if (btn) {
                refItems.push(btn);
              } else {
                refItems.splice(0, 1);
              }
            }}
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="s"
            title={`Cancel action from delete ${
              typeDelete === "board" ? "board" : "task"
            }?`}
            aria-label={`Cancel action from delete ${
              typeDelete === "board" ? "board" : "task"
            }?`}
            className="dialog-delete__btn-cancel"
            onPointerDown={handlePointerDownBtnCancel}
            onKeyDown={(e) => {
              handleKeyDownBtnCancel(e);
            }}
            ref={(btn) => {
              const refItems = getRefs(refBtns);
              if (btn) {
                refItems.push(btn);
              } else {
                refItems.splice(1, 1);
              }
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </BackdropModal>
  );

  return createPortal(template, document.body);
}
