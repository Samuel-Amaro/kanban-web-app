import { useRef, useState } from "react";
import { useDataContext } from "../../context/DataContext";
import Button from "../Button";
import Heading from "../Heading";
import "./Content.css";
import BoardModal from "../Modals/BoardModal";
import { Column, Task } from "../../data";
import { random } from "../../utils";
import ViewTask from "../Modals/ViewTask";

export default function Main() {
  const [modalEditBoardIsOppen, setModalEditBoardIsOppen] = useState(false);
  const dataContext = useDataContext();
  const selectedBoard = dataContext.datas.find(
    (b) => b.id === dataContext.selectedIdBoard
  );

  //TODO: ADD EVENTS E STATES NECESSARIOS PARA MOSTRAR MODAIS CORRESPONDENTES
  //TODO: ADD STATE E CHAMAR MODAL VIEW TASK

  return (
    <>
      <main
        className={
          !selectedBoard?.columns.length
            ? "main-content main-content--empty "
            : "main-content"
        }
        aria-live="polite"
        aria-atomic="true"
      >
        {
          selectedBoard
            ? selectedBoard.columns.length === 0 && (
                <BoardIsEmpty
                  onModalEditBoardIsOppen={(isOppen: boolean) => {
                    setModalEditBoardIsOppen(isOppen);
                  }}
                />
              )
            : null /*//TODO: add uma mensagem de quando não ha um board selected*/
        }
        {selectedBoard?.columns && selectedBoard.columns.length > 0 && (
          <>
            {selectedBoard.columns.map((column) => {
              return <ColumnBoard dataColumn={column} key={column.id} />;
            })}
            <button
              type="button"
              className="main-content__btn-column"
              title="+ New Column"
              aria-label="+ New Column"
            >
              + New Column
            </button>
          </>
        )}
      </main>
      {modalEditBoardIsOppen && (
        <BoardModal
          type="edit"
          isOpen={modalEditBoardIsOppen}
          onHandleOpen={(isOppen: boolean) => {
            setModalEditBoardIsOppen(isOppen);
          }}
          initialData={selectedBoard}
        />
      )}
    </>
  );
}

type PropsColumnBoard = {
  dataColumn: Column;
};

function ColumnBoard({ dataColumn }: PropsColumnBoard) {
  return (
    <section
      className={
        dataColumn.tasks.length > 0
          ? "main-content__column"
          : "main-content__column main-content__column--empty"
      }
    >
      <div className="main-content__container-heading">
        <span
          className="main-content__color-marking"
          style={{
            backgroundColor: `rgb(${random(0, 255)} ${random(0, 255)} ${random(
              0,
              255
            )})`,
          }}
        ></span>
        <Heading level={4} className="main-content__name-column">
          {`${dataColumn.name} (${dataColumn.tasks.length})`.toUpperCase()}
        </Heading>
      </div>
      {dataColumn.tasks.length > 0 && <TaskList tasks={dataColumn.tasks} />}
    </section>
  );
}

type PropsTaskList = {
  tasks: Task[];
};

function TaskList({ tasks }: PropsTaskList) {
  return (
    <ul className="main-content__tasks-list">
      {tasks.map((t) => {
        return (
          <li className="main-content__task-item" key={t.id}>
            <CardTask dataTask={t} />
          </li>
        );
      })}
    </ul>
  );
}

type PropsCardTask = {
  dataTask: Task;
};

function CardTask({ dataTask }: PropsCardTask) {
  const [modalViewTaskIsOppen, setModalViewTaskIsOppen] = useState(false);
  const refCardBtn = useRef<HTMLButtonElement | null>(null);
  const totalSubtasks = dataTask.subtasks.length;
  const totalSubtasksCompleteds = dataTask.subtasks.filter(
    (st) => st.isCompleted
  ).length;

  function handlePointerDown() {
    setModalViewTaskIsOppen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (e.key === "Enter" || e.key === " ") {
      setModalViewTaskIsOppen(true);
    }
  }

  return (
    <>
      <button
        type="button"
        className="main-content__card-task"
        title={`View Task ${dataTask.title}`}
        aria-label={`View Task ${dataTask.title}`}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        ref={refCardBtn}
      >
        <span className="main-content__task-title">{dataTask.title}</span>
        <span className="main-content__stat-subtasks">
          {`${totalSubtasksCompleteds} of ${totalSubtasks} substasks`}
        </span>
      </button>
      {modalViewTaskIsOppen && (
        <ViewTask
          isOpen={modalViewTaskIsOppen}
          onHandleOpen={(isOppen: boolean) => {
            refCardBtn.current?.focus();
            setModalViewTaskIsOppen(isOppen);
          }}
          data={dataTask}
        />
      )}
    </>
  );
}

type PropsBoardIsEmpty = {
  onModalEditBoardIsOppen: (isOppen: boolean) => void;
};

function BoardIsEmpty({ onModalEditBoardIsOppen }: PropsBoardIsEmpty) {
  function handlePointerDownBtnAddColumn() {
    onModalEditBoardIsOppen(true);
  }

  function handleKeyDownBtnAddColumn(
    e: React.KeyboardEvent<HTMLButtonElement>
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onModalEditBoardIsOppen(true);
    }
    return;
  }
  return (
    <div className="main-content__container">
      <Heading level={2} className="main-content__message">
        This board is empty. Create a new column to get started.
      </Heading>
      <Button
        type="button"
        size="l"
        variant="primary"
        className="main-content__btn-add-column"
        onPointerDown={handlePointerDownBtnAddColumn}
        onKeyDown={handleKeyDownBtnAddColumn}
        title="+ Add New Column"
        aria-label="+ Add New Column"
      >
        + Add New Column
      </Button>
    </div>
  );
}
