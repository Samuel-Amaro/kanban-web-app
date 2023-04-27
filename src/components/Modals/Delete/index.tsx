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
import useNoScroll from "../../../hooks/useNoScroll";
import useKeydownWindow from "../../../hooks/useKeydownWindow";
import { Board, Task } from "../../../data";

//TODO: construir um componente generico para ter props dinamicas

type PropsModal = {
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
};

interface DeleteBoard<TypeDelete> extends PropsModal {
  nameBoard: string;
  idBoard: string;
  typeDelete: TypeDelete;
}

interface DeleteTask<TypeDelete> extends PropsModal {
  idBoard: string;
  titleTask: string;
  idTask: string;
  idColumn: string;
  selectedBoard: Board;
  typeDelete: TypeDelete;
}

type PropsModalDeleteTaskOrBoard<TypeDelete extends "board" | "task"> =
  TypeDelete extends "board" ? DeleteBoard<TypeDelete> : DeleteTask<TypeDelete>;

type PropsDeleteModal<TypeDelete extends "board" | "task"> =
  PropsModalDeleteTaskOrBoard<TypeDelete>;

/*type PropsDeleteModal = {
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  typeDelete: "board" | "task";
  title_or_name: string;
  id: string;
  selectedBoard: Board | null;
};*/

export default function DeleteModal<TypeDelete extends "board" | "task">(
  /*{
  isOpen,
  onHandleOpen,
  props
  typeDelete,
  title_or_name,
  id,
  selectedBoard,
}:PropsDeleteModal*/ props: PropsDeleteModal<TypeDelete>
) {
  const refDialog = useRef<HTMLDivElement | null>(null);
  const refBtns = useRef<HTMLButtonElement[] | null>(null);
  const dispatchDatasContext = useDatasDispatch();

  function handleKeyDownDialog(e: KeyboardEvent) {
    e.stopPropagation();
    switch (e.key) {
      case "Esc":
      case "Escape":
        props.onHandleOpen(false);
        break;
      default:
        break;
    }
  }

  function handlePointerDownBtnDelete() {
    if (props.typeDelete === "board") {
      dispatchDatasContext({
        type: "delete_board",
        idBoard: props.idBoard /*id*/,
      });
      return;
    }
    if (props.typeDelete === "task") {
      /*const idColumn = selectedBoard.columns.filter(
            (column) =>
              column.name.toLowerCase() === initialData.status.toLowerCase()
          )[0].id;
      dispatchDatasContext({type: "delete_task", idBoard: selectedBoard.id, sele})*/
      //TODO: IMPLEMENTAR LOGICA PARA CHAMAR DISPATCH DATAS CONTEXT PARA EXCLUIR UMA TASK, IMPLEMENTAR CASE NO REDUCER DATAS REDUCER
    }
    props.onHandleOpen(false);
  }

  function handleKeyDownBtnDelete(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case "Enter":
      case " ":
        if (props.typeDelete === "board") {
          dispatchDatasContext({
            type: "delete_board",
            idBoard: props.idBoard /*id*/,
          });
        }
        if (props.typeDelete === "task") {
          //TODO: IMPLEMENTAR LOGICA PARA CHAMAR DISPATCH DATAS CONTEXT PARA EXCLUIR UMA TASK, IMPLEMENTAR CASE NO REDUCER DATAS REDUCER
        }
        props.onHandleOpen(false);
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
    props.onHandleOpen(false);
  }

  function handleKeyDownBtnCancel(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case "Enter":
      case " ":
        props.onHandleOpen(false);
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

  useKeydownWindow(handleKeyDownDialog);

  useNoScroll();

  if (!props.isOpen) {
    return null;
  }

  const messageDeleteBoard = `Are you sure you want to delete the ‘${
    props.typeDelete === "board" ? props.nameBoard : ""
  }’ board? This action will remove all columns and tasks and cannot be reversed.`;

  const messageDeleteTask = `Are you sure you want to delete the ‘${
    props.typeDelete === "task" ? props.titleTask : ""
  }’ task and its subtasks? This action cannot be reversed.`;

  const template = (
    <BackdropModal onHandleOpenModal={() => props.onHandleOpen(false)}>
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
          {`Delete this ${props.typeDelete === "board" ? "board" : "task"}?`}
        </Heading>
        <p className="dialog-delete__message">
          {props.typeDelete === "board"
            ? messageDeleteBoard
            : messageDeleteTask}
        </p>
        <div className="dialog-delete__buttons">
          <Button
            type="button"
            variant="destructive"
            size="s"
            title={`Delete ${props.typeDelete === "board" ? "board" : "task"}?`}
            aria-label={`Delete ${
              props.typeDelete === "board" ? "board" : "task"
            }?`}
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
              props.typeDelete === "board" ? "board" : "task"
            }?`}
            aria-label={`Cancel action from delete ${
              props.typeDelete === "board" ? "board" : "task"
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
