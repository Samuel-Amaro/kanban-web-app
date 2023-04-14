import { useState } from "react";
import { useDataContext } from "../../context/DataContext";
import Button from "../Button";
import Heading from "../Heading";
import "./Content.css";
import BoardModal from "../Modals/BoardModal";

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
      onModalEditBoardIsOppen(true);
    }
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
      >
        + Add New Column
      </Button>
    </div>
  );
}
