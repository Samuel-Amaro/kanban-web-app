import { createPortal } from "react-dom";
import { Task } from "../../../data";
import BackdropModal from "../../BackdropModal";
import Heading from "../../Heading";
import "./ViewTask.css";
import { useRef } from "react";
import DropdownMenu from "../../DropdownMenu";
import DropdownStatus, { OptionStatus } from "../../DropdownStatus";
import { useDataContext, useDatasDispatch } from "../../../context/DataContext";

type PropsViewTaskModal = {
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  data: Task;
};

//TODO: ADD HTML SEMANTICO E ACESSIVEL
//TODO: VERIFICAR DATA

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


  function handleChangeDropdownOptionMenu(value: string) {
    if (value === "edit") {
      alert("edit task");
    }
    if (value === "delete") {
      alert("delete task");
    }
  }

  function handleChangeDropdownOptionStatus(option: OptionStatus) {
    console.log(option);
  }

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
        {
          //TODO: ADD STATE PARA CONTROLAR MULTIPLOS CHECKBOXES, AO ALTERNAR O STATE DO CHECKBOX ATUALIZAR O STATE COM DISPATCH DESPACHANDO A TAREFA CORRETA, PARA ATUALIZAR O QUE ACONTECEU COM A SUBTASK, ATUALIZAR O STATE DO DATAS CONTEXT WITH O DISPATCH
          data.subtasks.length > 0 && (
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
                      title={`checked ${subtask.title}`}
                    />
                    <label
                      className="dialog-viewtask__label"
                      htmlFor={subtask.id}
                    >
                      {subtask.title}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
        <Heading level={4} className="dialog-viewtask__subtitle">
          Current Status
        </Heading>
        {optionsDropdownStatus && (
          <DropdownStatus
            options={optionsDropdownStatus}
            onChange={handleChangeDropdownOptionStatus}
            defaultOption={null} /*data.status e como valor nome da column temos que trocar por id da column para facilitar pesquisa*/
          />
        )}
      </div>
    </BackdropModal>
  );

  return createPortal(template, document.body);
}
