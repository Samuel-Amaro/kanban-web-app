import { createPortal } from "react-dom";
import { Column, Subtask, Task } from "../../../data";
import BackdropModal from "../../BackdropModal";
import Heading from "../../Heading";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import CrossIcon from "../../Icons/Cross";
import Button from "../../Button";
import DropdownStatus, { OptionStatus } from "../../DropdownStatus";
import { useDataContext } from "../../../context/DataContext";
import "./Task.css";

type PropsModalTask = {
  type: "add" | "edit";
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  initialData?: { idBoard: string; idColumn: string; task: Task };
};

export default function ModalTask({
  type,
  isOpen,
  onHandleOpen,
  initialData,
}: PropsModalTask) {
  const datasContext = useDataContext();
  const selectedBoard = datasContext.datas.find(
    (b) => b.id === datasContext.selectedIdBoard
  );
  /*const selectedBoard = useMemo(
    () => datasContext.datas.find((b) => b.id === datasContext.selectedIdBoard),
    [datasContext]
  );*/
  const refInputTitleTask = useRef<HTMLInputElement | null>(null);
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

  const [task, setTask] = useState<Task>(
    initialData && type === "add" ? initialData.task : defaultDatasTask
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

  function handleChangeDropdownOptionStatus(option: OptionStatus) {
    setTask({
      ...task,
      status: option.label,
    });
  }

  function handleChangedTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTask({ ...task, title: e.target.value });
  }

  function handleChangedDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTask({ ...task, description: e.target.value });
  }

  function handleChangedTitleSubtask(
    e: React.ChangeEvent<HTMLInputElement>,
    subtask: Subtask
  ) {
    setTask({
      ...task,
      subtasks: task.subtasks.map((sub) => {
        if (sub.id === subtask.id) {
          return {
            ...sub,
            title: e.target.value,
          };
        }
        return sub;
      }),
    });
  }

  function handlePointerDownBtnRemoveSubtask(idSubtask: string) {
    setTask({
      ...task,
      subtasks: task.subtasks.filter((sub) => sub.id !== idSubtask),
    });
  }

  function handleKeydownBtnRemoveSubtask(
    e: React.KeyboardEvent<HTMLButtonElement>,
    idSubtask: string
  ) {
    if (e.key === "Enter" || e.key === "") {
      setTask({
        ...task,
        subtasks: task.subtasks.filter((sub) => sub.id !== idSubtask),
      });
    }
  }

  function handlePointerDownBtnAddSubtask() {
    const newSubtask: Subtask = {
      id: `subtask-${nanoid(5)}`,
      title: "",
      isCompleted: false,
    };
    setTask({
      ...task,
      subtasks: [...task.subtasks, newSubtask],
    });
  }

  function handleKeydownBtnAddSubtask(
    e: React.KeyboardEvent<HTMLButtonElement>
  ) {
    if (e.key === "Enter" || e.key === "") {
      const newSubtask: Subtask = {
        id: `subtask-${nanoid(5)}`,
        title: "",
        isCompleted: false,
      };
      setTask({
        ...task,
        subtasks: [...task.subtasks, newSubtask],
      });
    }
  }

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    //TODO: handler submit form
    e.preventDefault();
  }

  useEffect(() => {
    //ao abrir modal foca primeiro campo
    refInputTitleTask.current?.focus();
  }, []);

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
        /*ref={refDialog}*/
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
              className="dialog-task__form-input"
              title="Title task"
              ref={refInputTitleTask}
              value={task.title}
              onChange={handleChangedTitle}
            />
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
                    className="dialog-task__form-input"
                    aria-label="Subtask"
                    title="Subtask"
                    value={subtask.title}
                    onChange={(e) => handleChangedTitleSubtask(e, subtask)}
                  />
                  <button
                    type="button"
                    title="Remove subtask from task"
                    className="dialog-task__btn-remove-subtask"
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
              //TODO: comportamento estranho no dropdow status, ao escolher um option fechar o dropdown, fechar o modal, e isso esta errado, comportamento certo e fechar somente o dropdown
              <DropdownStatus
                options={optionsDropdownStatus}
                onChange={handleChangeDropdownOptionStatus}
                defaultOption={
                  type === "add"
                    ? optionsDropdownStatus[0]
                    : optionsDropdownStatus.filter(
                        (option) =>
                          option.label.toLowerCase() ===
                          initialData?.task.status.toLowerCase()
                      )[0]
                }
              />
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
