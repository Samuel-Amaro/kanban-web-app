import { createPortal } from "react-dom";
import { Board, Subtask, Task } from "../../../data";
import BackdropModal from "../../BackdropModal";
import Heading from "../../Heading";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { nanoid } from "nanoid";
import CrossIcon from "../../Icons/Cross";
import Button from "../../Button";
import DropdownStatus, { OptionStatus } from "../../DropdownStatus";
import "./Task.css";
import useNoScroll from "../../../hooks/useNoScroll";
import { taskReducer } from "../../../reducers/taskReducer";
import {
  DataErrorsTaskForm,
  formTaskIsValid,
  getFocusableElements,
  nextFocusable,
  validationFieldsFormTask,
} from "../../../utils";
import { useDatasDispatch } from "../../../context/DataContext";
import useKeydownWindow from "../../../hooks/useKeydownWindow";

type PropsModalTask = {
  type: "add" | "edit";
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  initialData?: Task | undefined;
  selectedBoard: Board | undefined;
};

export default function ModalTask({
  type,
  isOpen,
  onHandleOpen,
  initialData,
  selectedBoard,
}: PropsModalTask) {
  const dispatchDatasContext = useDatasDispatch();
  const refInputTitleTask = useRef<HTMLInputElement | null>(null);
  const refDialog = useRef<HTMLDivElement | null>(null);
  const optionsDropdownStatus: OptionStatus[] | null = selectedBoard
    ? selectedBoard.columns.map((column) => {
        return {
          value: column.name,
          label: column.name,
          id: column.id,
        };
      })
    : null;
  const defaultDatasSubtask: Subtask[] = [
    { id: `subtask-${nanoid(5)}`, title: "", isCompleted: false },
    { id: `subtask-${nanoid(5)}`, title: "", isCompleted: false },
  ];
  const defaultDatasTask: Task = {
    id: `task-${nanoid(5)}`,
    title: "",
    description: "",
    status: optionsDropdownStatus ? optionsDropdownStatus[0].label : "",
    subtasks: defaultDatasSubtask,
  };
  const [errorsFormTask, setErrorsFormTask] = useState<DataErrorsTaskForm>({
    title: undefined,
    status: undefined,
    subtasks: [],
  });
  const [task, dispatch] = useReducer(
    taskReducer,
    initialData && type === "edit" ? initialData : defaultDatasTask
  );

  type DatasSubtaskRefactor = { subtask: Subtask; placeholder: string };

  const subtasks: DatasSubtaskRefactor[] = task.subtasks.map(
    (subtask, index) => {
      if (index === 0) {
        return {
          subtask: subtask,
          placeholder: "e.g. Make coffee",
        };
      }
      if (index === 1) {
        return {
          subtask: subtask,
          placeholder: "e.g. Drink coffee & smile",
        };
      }
      return {
        subtask: subtask,
        placeholder: "title resume subtask",
      };
    }
  );

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

  function handleChangeDropdownOptionStatus(option: OptionStatus) {
    dispatch({ type: "handle_status_task", status: option.label });
  }

  function handleChangedTitle(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "handle_changed_title", newTitle: e.target.value });
  }

  function handleChangedDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    dispatch({
      type: "handle_changed_description",
      newDescription: e.target.value,
    });
  }

  function handleChangedTitleSubtask(
    e: React.ChangeEvent<HTMLInputElement>,
    subtask: Subtask
  ) {
    dispatch({
      type: "handle_changed_title_subtask",
      newTitleSubtask: e.target.value,
      subtask: subtask,
    });
  }

  function handlePointerDownBtnRemoveSubtask(idSubtask: string) {
    dispatch({
      type: "handle_removed_subtask",
      idSubtask: idSubtask,
    });
  }

  function handleKeydownBtnRemoveSubtask(
    e: React.KeyboardEvent<HTMLButtonElement>,
    idSubtask: string
  ) {
    if (e.key === "Enter" || e.key === "") {
      dispatch({
        type: "handle_removed_subtask",
        idSubtask: idSubtask,
      });
    }
  }

  function handlePointerDownBtnAddSubtask() {
    dispatch({
      type: "handle_add_subtask",
    });
  }

  function handleKeydownBtnAddSubtask(
    e: React.KeyboardEvent<HTMLButtonElement>
  ) {
    if (e.key === "Enter" || e.key === "") {
      dispatch({
        type: "handle_add_subtask",
      });
    }
  }

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const resultValidationFielsFormTask = validationFieldsFormTask(task);
    setErrorsFormTask(resultValidationFielsFormTask);
    if (formTaskIsValid(resultValidationFielsFormTask)) {
      switch (type) {
        case "add": {
          if (!selectedBoard) return;
          const idColumn = selectedBoard.columns.filter(
            (column) => column.name.toLowerCase() === task.status.toLowerCase()
          )[0].id;
          dispatchDatasContext({
            type: "save_new_task",
            task: task,
            idBoard: selectedBoard.id,
            idColumn: idColumn,
          });
          onHandleOpen(false);
          break;
        }
        case "edit": {
          if (!selectedBoard || !initialData) return;
          //verificar se precisa mudar status da task
          //não mudou status da task
          const idColumnSource = selectedBoard.columns.filter(
            (column) =>
              column.name.toLowerCase() === initialData.status.toLowerCase()
          )[0].id;
          const idColumnTarget = selectedBoard.columns.filter(
            (column) => column.name.toLowerCase() === task.status.toLowerCase()
          )[0].id;
          if (initialData.status.toLowerCase() === task.status.toLowerCase()) {
            dispatchDatasContext({
              type: "edit_task",
              idBoard: selectedBoard.id,
              idColumn: idColumnTarget,
              taskChanged: task,
            });
            onHandleOpen(false);
            return;
          }
          //mudou status da task
          dispatchDatasContext({
            type: "changed_status_task",
            idBoard: selectedBoard.id,
            sourceColumnId: idColumnSource,
            idTask: task.id,
            newStatusTask: task.status,
            targetColumnId: idColumnTarget,
          });
          dispatchDatasContext({
            type: "edit_task",
            idBoard: selectedBoard.id,
            idColumn: idColumnTarget,
            taskChanged: task,
          });
          onHandleOpen(false);
          break;
        }
        default:
          break;
      }
    }
  }

  useNoScroll();

  useEffect(() => {
    //ao abrir modal foca primeiro campo
    refInputTitleTask.current?.focus();
  }, []);

  useKeydownWindow(handleKeyDownDialog);

  const template = (
    <BackdropModal
      onHandleOpenModal={() => {
        onHandleOpen(false);
      }}
    >
      <div
        className="dialog-task"
        role="dialog"
        id="dialog-task"
        aria-labelledby="dialog-task-label"
        aria-modal="true"
        ref={refDialog}
      >
        <Heading
          level={2}
          className="dialog-task__title"
          id="dialog-task-label"
        >
          {type === "add" ? "Add New Task" : "Edit Task"}
        </Heading>
        <form className="dialog-task__form" onSubmit={handleSubmitForm}>
          <div className="dialog-task__form-group">
            <label htmlFor="title-task" className="dialog-task__form-label">
              Title
            </label>
            <input
              type="text"
              id="title-task"
              name="title-task"
              placeholder="e.g. Take coffee bre"
              className={
                errorsFormTask.title
                  ? "dialog-task__form-input dialog-task__input--error"
                  : "dialog-task__form-input"
              }
              title="Title task"
              ref={refInputTitleTask}
              value={task.title}
              onChange={handleChangedTitle}
            />
            {errorsFormTask.title && (
              <span className="dialog-task__error-input" aria-live="polite">
                {`${errorsFormTask.title}`}
              </span>
            )}
          </div>
          <div className="dialog-task__form-group">
            <label
              htmlFor="description-task"
              className="dialog-task__form-label"
            >
              Description
            </label>
            <textarea
              id="description-task"
              className="dialog-task__form-textarea"
              name="description-task"
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
              title="Description task"
              value={task.description}
              onChange={handleChangedDescription}
            />
          </div>
          <div className="dialog-task__form-group-subtasks">
            <label htmlFor="subtasks" className="dialog-task__form-label">
              Subtasks
            </label>
            {subtasks.map(({ subtask, placeholder }: DatasSubtaskRefactor) => {
              const errorFiltered = errorsFormTask.subtasks.filter(
                (defs) => defs.id === subtask.id
              );
              const error =
                errorFiltered.length > 0
                  ? errorFiltered[0]
                  : { id: "", error: "" };
              return (
                <div
                  className="dialog-task__form-group-container-subtask"
                  key={subtask.id}
                >
                  <input
                    type="text"
                    id={subtask.id}
                    name={`subtask-index`}
                    placeholder={placeholder}
                    className={
                      error.error
                        ? "dialog-task__form-input dialog-task__input--error"
                        : "dialog-task__form-input"
                    }
                    aria-label="Subtask"
                    title="Subtask"
                    value={subtask.title}
                    onChange={(e) => handleChangedTitleSubtask(e, subtask)}
                  />
                  <button
                    type="button"
                    title="Remove subtask from task"
                    className={
                      error.error
                        ? "dialog-task__btn-remove-subtask dialog-task__btn-remove-subtask--error"
                        : "dialog-task__btn-remove-subtask"
                    }
                    aria-label="Remove subtask from task"
                    onPointerDown={() =>
                      handlePointerDownBtnRemoveSubtask(subtask.id)
                    }
                    onKeyDown={(e) =>
                      handleKeydownBtnRemoveSubtask(e, subtask.id)
                    }
                  >
                    <CrossIcon className="dialog-task__icon-btn-remove-subtask" />
                  </button>
                  {error.error && (
                    <span
                      className="dialog-task__error-input"
                      aria-live="polite"
                    >
                      {`${error.error}`}
                    </span>
                  )}
                </div>
              );
            })}
            <Button
              type="button"
              variant="secondary"
              size="s"
              title="+ Add New Subtask"
              aria-label="+ Add New Subtask"
              className="dialog-task__btn-add-subtask"
              onPointerDown={handlePointerDownBtnAddSubtask}
              onKeyDown={handleKeydownBtnAddSubtask}
            >
              + Add New Subtask
            </Button>
          </div>
          <div className="dialog-task__form-group">
            <label htmlFor="status" className="dialog-task__form-label">
              Status
            </label>
            {optionsDropdownStatus && (
              <>
                <DropdownStatus
                  options={optionsDropdownStatus}
                  onChange={handleChangeDropdownOptionStatus}
                  defaultOption={
                    type === "add"
                      ? optionsDropdownStatus[0]
                      : optionsDropdownStatus.filter(
                          (option) =>
                            option.label.toLowerCase() ===
                            initialData?.status.toLowerCase()
                        )[0]
                  }
                />
                {errorsFormTask.status && (
                  <span className="dialog-task__error-input" aria-live="polite">
                    {`${errorsFormTask.status}`}
                  </span>
                )}
              </>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="s"
            title={type === "add" ? "Create Task" : "Save Changes"}
            aria-label={type === "add" ? "Create Task" : "Save Changes"}
            className="dialog-task__btn-submit-form"
          >
            {type === "add" ? "Create Task" : "Save Changes"}
          </Button>
        </form>
      </div>
    </BackdropModal>
  );

  if (!isOpen) {
    return null;
  }

  return createPortal(template, document.body);
}