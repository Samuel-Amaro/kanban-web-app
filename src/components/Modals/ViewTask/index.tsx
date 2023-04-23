import { createPortal } from "react-dom";
import { Subtask, Task } from "../../../data";
import BackdropModal from "../../BackdropModal";
import Heading from "../../Heading";
import "./ViewTask.css";
import { useEffect, useRef } from "react";
import DropdownMenu from "../../DropdownMenu";
import DropdownStatus, { OptionStatus } from "../../DropdownStatus";
import { useDataContext, useDatasDispatch } from "../../../context/DataContext";
import useNoScroll from "../../../hooks/useNoScroll";
import { getFocusableElements, nextFocusable } from "../../../utils";
import useKeydownWindow from "../../../hooks/useKeydownWindow";

type PropsViewTaskModal = {
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  data: Task;
};

const optionsDropdownMenu = [
  { value: "edit", label: "Edit Task" },
  { value: "delete", label: "Delete Task" },
];

export default function ViewTask({
  isOpen,
  onHandleOpen,
  data,
}: PropsViewTaskModal) {
  const dispatchDatasContext = useDatasDispatch();
  const datasContext = useDataContext();
  const totalSubtasks = data.subtasks.length;
  const totalSubtasksCompleteds = data.subtasks.filter(
    (st) => st.isCompleted
  ).length;
  const refBtnDropdown = useRef<HTMLButtonElement | null>(null);
  const refDialog = useRef<HTMLDivElement | null>(null);
  const selectedBoard = datasContext.datas.find(
    (b) => b.id === datasContext.selectedIdBoard
  );
  const optionsDropdownStatus: OptionStatus[] | null = selectedBoard
    ? selectedBoard.columns.map((column) => {
        return {
          value: column.name,
          label: column.name,
          id: column.id,
        };
      })
    : null;

  function handleChangeCheckbox(
    e: React.ChangeEvent<HTMLInputElement>,
    subtask: Subtask
  ) {
    if (selectedBoard) {
      const column = selectedBoard?.columns.filter(
        (column) =>
          column.name.toLocaleLowerCase() === data.status.toLocaleLowerCase()
      )[0];
      dispatchDatasContext({
        type: "changed_status_subtask",
        idBoard: selectedBoard?.id,
        idColumn: column.id,
        idTask: data.id,
        idSubtask: subtask.id,
        newStatusSubtask: !subtask.isCompleted,
      });
    }
  }

  //* INFO: QUAL OPTION DO MENU O SER ESCOLHEU, CADA OPTION ABRE UM MODAL SOBRE TASKS
  //TODO: cada value e para chamar um modal de editar task ou delete task
  //TODO: implementar este event
  function handleChangeDropdownOptionMenu(value: string) {
    if (value === "edit") {
      console.log("edit task");
    }
    if (value === "delete") {
      console.log("delete task");
    }
  }

  //* INFO: QUAL OPTION DO STATUS O USER ESCOLHEU PARA ATUALIZAR STATUS DE UMA SUBTASK
  function handleChangeDropdownOptionStatus(option: OptionStatus) {
    if (selectedBoard) {
      const column = selectedBoard?.columns.filter(
        (column) =>
          column.name.toLocaleLowerCase() === data.status.toLocaleLowerCase()
      )[0];
      dispatchDatasContext({
        type: "changed_status_task",
        idBoard: selectedBoard?.id,
        sourceColumnId: column.id,
        idTask: data.id,
        newStatusTask: option.label,
        targetColumnId: option.id,
      });
    }
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

  useNoScroll();

  useEffect(() => {
    //ao abrir modal foca no btn dropdowm menu
    if (refBtnDropdown.current) refBtnDropdown.current.focus();
  }, []);

  useKeydownWindow(handleKeyDownDialog);

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
        className="dialog-viewtask"
        role="dialog"
        id="dialog-viewtask"
        aria-labelledby="dialog-label"
        aria-modal="true"
        ref={refDialog}
      >
        <header className="dialog-viewtask__header-container">
          <Heading
            level={2}
            className="dialog-viewtask__title"
            id="dialog-viewtask-label"
          >
            {data.title}
          </Heading>
          <DropdownMenu
            options={optionsDropdownMenu}
            onChange={handleChangeDropdownOptionMenu}
            ref={refBtnDropdown}
            className="dialog-viewtask__dropdown-menu"
          />
        </header>
        {data.description && (
          <p className="dialog-viewtask__description">{data.description}</p>
        )}
        <Heading
          level={4}
          className="dialog-viewtask__subtitle"
          id="subtasks-labelledy"
        >{`Subtasks (${totalSubtasksCompleteds} of ${totalSubtasks})`}</Heading>
        {data.subtasks.length > 0 && (
          <ul
            className="dialog-viewtask__list-subtasks"
            aria-labelledby="subtasks-labelledy"
          >
            {data.subtasks.map((subtask) => (
              <li className="dialog-viewtask__subtask" key={subtask.id}>
                <div className="dialog-viewtask__view-subtask">
                  <input
                    type="checkbox"
                    id={subtask.id}
                    checked={subtask.isCompleted}
                    value={subtask.title}
                    className="dialog-viewtask__input"
                    title={`${subtask.title}`}
                    onChange={(e) => handleChangeCheckbox(e, subtask)}
                    name="subtask"
                  />
                  <label
                    className={
                      subtask.isCompleted
                        ? "dialog-viewtask__label dialog-viewtask__label--is-completed"
                        : "dialog-viewtask__label"
                    }
                    htmlFor={subtask.id}
                  >
                    {subtask.title}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Heading level={4} className="dialog-viewtask__subtitle">
          Current Status
        </Heading>
        {optionsDropdownStatus && (
          <DropdownStatus
            options={optionsDropdownStatus}
            onChange={handleChangeDropdownOptionStatus}
            defaultOption={
              optionsDropdownStatus.filter(
                (option) =>
                  option.label.toLowerCase() === data.status.toLowerCase()
              )[0]
            }
          />
        )}
      </div>
    </BackdropModal>
  );

  return createPortal(template, document.body);
}
