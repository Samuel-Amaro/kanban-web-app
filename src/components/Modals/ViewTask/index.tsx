import { createPortal } from "react-dom";
import { Task } from "../../../data";
import BackdropModal from "../../BackdropModal";
import Heading from "../../Heading";

type PropsViewTaskModal = {
  isOpen: boolean;
  onHandleOpen: (isOpen: boolean) => void;
  data: Task;
};

//TODO: ADD HTML SEMANTICO E ACESSIVEL
//TODO: VERIFICAR DATA

export default function ViewTask({
  isOpen,
  onHandleOpen,
  data,
}: PropsViewTaskModal) {
  const totalSubtasks = data.subtasks.length;
  const totalSubtasksCompleteds = data.subtasks.filter(
    (st) => st.isCompleted
  ).length;

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
          {/*//TODO: AQUI VAI UM DROPDOWM PARA ESCOLHER OUTROS MODAIS DE EDIÇÃO E DELETAR UMA TASK
            //TODO: SO QUE HA UM PROBLEMA TEMOS QUE TENTAR REUTILIZAR O DROPDOWN DO OPTIONS DO BOARD PORQUE SÃO PARECEIDOS, TENTAR ADAPTAR O COMPONENTE QUE JA EXISTE, PARA REUTILIZAÇÃO
            //TODO: E UM BUTTON QUE ABRE UM DROPDOWN COM BUTTONS QUE ABREM MODAIS
          */}
        </header>
        <p className="dialog-viewtask__description">{data.description}</p>
        <Heading
          level={4}
          className="dialog-viewtask__subtitle"
        >{`Subtasks (${totalSubtasksCompleteds} of ${totalSubtasks})`}</Heading>
      </div>
    </BackdropModal>
  );

  return createPortal(template, document.body);
}
