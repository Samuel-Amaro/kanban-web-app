import React, { useMemo, useRef, useState } from "react";
import Button from "../Button";
import Heading from "../Heading";
import "./Content.css";
import BoardModal from "../Modals/BoardModal";
import { Board, Column, Task } from "../../data";
import { getFocusableElements, nextFocusable, random } from "../../utils";
import ViewTask from "../Modals/ViewTask";
import ModalTask from "../Modals/Task";
import DeleteModal from "../Modals/Delete";

type PropsMain = {
  selectedBoard: Board;
};

export default function Main({ selectedBoard }: PropsMain) {
  const [modalEditBoardIsOppen, setModalEditBoardIsOppen] = useState(false);
  const refMain = useRef<HTMLElement | null>(null);
  const refBtnAddColumn = useRef<HTMLButtonElement | null>(null);

  function handlePointerDownBtnAddColumn() {
    setModalEditBoardIsOppen(true);
  }

  function handleKeydownBtnAddColumn(
    e: React.KeyboardEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    if (e.key === " " || e.key === "Enter") {
      setModalEditBoardIsOppen(true);
      return;
    }
    if (e.key === "Tab") {
      nextFocusable(getFocusableElements(refMain.current), !e.shiftKey);
    }
  }

  return (
    <>
      <main
        className={
          !selectedBoard.columns.length
            ? "main-content main-content--empty "
            : "main-content"
        }
        aria-live="polite"
        aria-atomic="true"
        ref={refMain}
      >
        {selectedBoard.columns.length > 0 ? (
          <>
            {selectedBoard.columns.map((column) => {
              return (
                <ColumnBoard
                  dataColumn={column}
                  key={column.id}
                  selectedBoard={selectedBoard}
                />
              );
            })}
            <button
              type="button"
              className="main-content__btn-column"
              title="+ New Column"
              aria-label="+ New Column"
              onPointerDown={handlePointerDownBtnAddColumn}
              onKeyDown={(e) => handleKeydownBtnAddColumn(e)}
              ref={refBtnAddColumn}
            >
              + New Column
            </button>
          </>
        ) : (
          <BoardIsEmpty
            onModalEditBoardIsOppen={(isOppen: boolean) => {
              setModalEditBoardIsOppen(isOppen);
            }}
          />
        )}
      </main>
      {modalEditBoardIsOppen && (
        <BoardModal
          type="edit"
          isOpen={modalEditBoardIsOppen}
          onHandleOpen={(isOppen: boolean) => {
            refBtnAddColumn.current?.focus();
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
  selectedBoard: Board;
};

function ColumnBoard({ dataColumn, selectedBoard }: PropsColumnBoard) {
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
      {dataColumn.tasks.length > 0 && (
        <TaskList tasks={dataColumn.tasks} selectedBoard={selectedBoard} />
      )}
    </section>
  );
}

type PropsTaskList = {
  tasks: Task[];
  selectedBoard: Board;
};

function TaskList({ tasks, selectedBoard }: PropsTaskList) {
  return (
    <ul className="main-content__tasks-list">
      {tasks.map((t) => {
        return (
          <li className="main-content__task-item" key={t.id}>
            <CardTask dataTask={t} selectedBoard={selectedBoard} />
          </li>
        );
      })}
    </ul>
  );
}

type PropsCardTask = {
  dataTask: Task;
  selectedBoard: Board;
};

function CardTask({ dataTask, selectedBoard }: PropsCardTask) {
  const [modalViewTaskIsOppen, setModalViewTaskIsOppen] = useState(false);
  const [modalEditTaskIsOppen, setModalEditTaskIsOppen] = useState(false);
  const [modalDeleteTaskIsOppen, setModalDeleteTaskIsOppen] = useState(false);
  const refCardBtn = useRef<HTMLButtonElement | null>(null);
  const totalSubtasks = dataTask.subtasks.length;
  const totalSubtasksCompleteds = dataTask.subtasks.filter(
    (st) => st.isCompleted
  ).length;

  function handlePointerDown() {
    setModalViewTaskIsOppen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      setModalViewTaskIsOppen(true);
    }
  }

  const value = useMemo(() => selectedBoard, [selectedBoard]);

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
        tabIndex={0}
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
          selectedBoard={value}
          dropdownModalVisibilityStates={{
            stateModalEdit: modalEditTaskIsOppen,
            handleStateModalEdit: (state: boolean) => {
              setModalEditTaskIsOppen(state);
            },
            stateDeleteModal: modalDeleteTaskIsOppen,
            handleStateModalDelete: (state: boolean) => {
              setModalDeleteTaskIsOppen(state);
            },
          }}
        />
      )}
      {modalEditTaskIsOppen && (
        <ModalTask
          type="edit"
          isOpen={modalEditTaskIsOppen}
          onHandleOpen={(isOppen: boolean) => {
            setModalEditTaskIsOppen(isOppen);
          }}
          initialData={dataTask}
          selectedBoard={selectedBoard}
        />
      )}
      {modalDeleteTaskIsOppen && (
        <DeleteModal<"task">
          isOpen={modalDeleteTaskIsOppen}
          onHandleOpen={(isOppen: boolean) => {
            setModalDeleteTaskIsOppen(isOppen);
          }}
          idBoard={selectedBoard.id}
          titleTask={dataTask.title}
          idTask={dataTask.id}
          idColumn={
            selectedBoard.columns.filter(
              (column) =>
                column.name.toLowerCase() === dataTask.status.toLowerCase()
            )[0].id
          }
          typeDelete={"task"}
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

export function NoContent() {
  return (
    <main className="main-content main-content--no-content">
      <p className="main-content__messsage">Selected a board or create</p>
    </main>
  );
}