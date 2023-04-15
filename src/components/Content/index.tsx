import { useState } from "react";
import { useDataContext } from "../../context/DataContext";
import Button from "../Button";
import Heading from "../Heading";
import "./Content.css";
import BoardModal from "../Modals/BoardModal";
import { Column, Task } from "../../data";

export default function Main() {
  const [modalEditBoardIsOppen, setModalEditBoardIsOppen] = useState(false);
  const dataContext = useDataContext();
  const selectedBoard = dataContext.datas.find(
    (b) => b.id === dataContext.selectedIdBoard
  );

  return (
    <>
      <main
        className={
          !selectedBoard?.columns.length
            ? "main-content main-content--empty"
            : "main-content"
        }
        aria-live="polite"
        aria-atomic="true"
      >
        {!selectedBoard?.columns.length && (
          <BoardIsEmpty
            onModalEditBoardIsOppen={(isOppen: boolean) => {
              setModalEditBoardIsOppen(isOppen);
            }}
          />
        )}
        {selectedBoard?.columns && selectedBoard.columns.length > 0 && (
          <div className="main-content__container-columns">
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
          </div>
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
    <section className="main-content__column">
      <div className="main-content__container-heading">
        <span className="main-content__color-marking"></span>
        <Heading level={4}>
          {`${dataColumn.name} (${dataColumn.tasks.length})`}
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
    <ul className="main-content__tasks">
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
  const totalSubtasks = dataTask.subtasks.length;
  const totalSubtasksCompleteds = dataTask.subtasks.filter(
    (st) => st.isCompleted
  ).length;

  return (
    <button
      type="button"
      className="main-content__card-task"
      title={`View Task ${dataTask.title}`}
      aria-label={`View Task ${dataTask.title}`}
    >
      <span className="main-content__task-title">{dataTask.title}</span>
      <span className="main-content__stat-subtasks">
        {`${totalSubtasksCompleteds} of ${totalSubtasks} substasks`}
      </span>
    </button>
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
