import { useDataContext } from "../../context/DataContext";
import Button from "../Button";
import Heading from "../Heading";
import "./Content.css";

export default function Main() {
  const dataContext = useDataContext();
  const selectedBoard = dataContext.datas.find(
    (b) => b.id === dataContext.selectedIdBoard
  );

  const templateBoardIsEmpty = (
    <div className="main-content__container">
      <Heading level={2}className="main-content__message">
        This board is empty. Create a new column to get started.
      </Heading>
      <Button type="button" size="l" variant="primary" className="main-content__btn-add-column">
        + Add New Column
      </Button>
    </div>
  );

  return (
    <main
      className={
        !selectedBoard?.columns.length
          ? "main-content main-content--empty"
          : "main-content"
      }
      aria-live="polite"
      aria-atomic="true"
    >
      {!selectedBoard?.columns.length && templateBoardIsEmpty}
    </main>
  );
}
