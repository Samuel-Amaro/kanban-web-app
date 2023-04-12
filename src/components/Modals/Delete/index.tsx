import { createPortal } from "react-dom";
import BackdropModal from "../../BackdropModal";
import Heading from "../../Heading";
import Button from "../../Button";
import "./DeleteModal.css";
import { useEffect, useRef } from "react";
import { getFocusableElements, nextFocusable } from "../../../utils";
import { useDataContext, useDatasDispatch } from "../../../context/DataContext";

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
  const refBtnDelete = useRef<HTMLButtonElement | null>(null);
  const refDialog = useRef<HTMLDivElement | null>(null);

  const dispatchDatasContext = useDatasDispatch();
  const datasContext = useDataContext();

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

  function handlePointerDownBtnDelete(/*e: React.PointerEvent<HTMLButtonElement>*/) {
    //TODO: IMPLEMENTAR LOGICA PARA CHAMAR UM DISPATCH CONTEXT PARA EXCLUIR UM BOARD, OU TASK DEPENDENDO DO TYPE DELETE PROP, APOS DELETAR FECHAR MODAL
  }

  function handleKeyDownBtnDelete(e: React.KeyboardEvent<HTMLButtonElement>) {
    //TODO: IMPLEMENTAR LOGICA PARA CHAMAR UM DISPATCH CONTEXT PARA EXCLUIR UM BOARD, OU TASK DEPENDENDO DO TYPE DELETE PROP  APOS DELETAR FECHAR MODAL E VOLTAR FOCO PARA O ULTIMO ELEMENTO ANTERIOR ANTES DO MODAL SER ABERTO
  }

  function handlePointerDownBtnCancel() {
    //TODO: FECHAR MODAL
  }

  function handleKeyDownBtnCancel(e: React.KeyboardEvent<HTMLButtonElement>) {
    //TODO: FECHAR MODAL E VOLTAR FOCO PARA O ELEMENTO ANTERIOR ANTES DE ABRIR O MODAL
  }

  useEffect(() => {
    //ao abrir modal foca no btn delete
    refBtnDelete.current?.focus();
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
            ref={refBtnDelete}
            onPointerDown={handlePointerDownBtnDelete}
            onKeyDown={(e) => {
              handleKeyDownBtnDelete(e);
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
          >
            Cancel
          </Button>
        </div>
      </div>
    </BackdropModal>
  );

  return createPortal(template, document.body);
}
