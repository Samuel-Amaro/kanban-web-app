import Button from "../Button";
import BoardIcon from "../Icons/Board";
import { useDataContext } from "../context/DataContext";

export default function ListBoards() {
  const dataContext = useDataContext();
  return (
    <ul className="list-boards">
      {dataContext.datas.map((board, index) => {
        //TODO: add classe de active para demostrar na UI qual o board atual selecionado, mas para fazer isso devemos, adicionar ids, nos boards e columns para não comparar com somente nomes
        return (
          <li className="list-boards__item" key={index}>
            <Button
              type="button"
              size="l"
              className="list-boards__btn list-boards__btn--select-board"
              aria-label={`Select ${board.name} board`}
              title={`Select ${board.name} board`}
              onPointerDown={() => {
                dataContext.setCurrentSelectedBoard(board);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  dataContext.setCurrentSelectedBoard(board);
                }
              }}
            >
              <BoardIcon /> {board.name}
            </Button>
          </li>
        );
      })}
      <li className="sidebar__item">
        {/*//TODO: adicionar class de forma que destaque esse button dos demais, porque ele tem que visualmente ser destacado*/}
        <Button
          type="button"
          size="l"
          className="list-boards__btn list-boards__btn--create-board"
          aria-label="create new board"
          title={`create new board`}
          onPointerDown={() => {
            //TODO: chamar function do state do context data para criar um novo board
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              //TODO: chamar function do state do context data para criar um novo board
            }
          }}
        >
          <BoardIcon /> + Create New Board
        </Button>
      </li>
    </ul>
  );
}
