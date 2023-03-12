import Button from "../Button";
import Heading from "../Heading";
import BoardIcon from "../Icons/Board";
import Logo from "../Icons/Logo";
import { useDataContext } from "../context/DataContext";
import { useThemeContext } from "../context/ThemeContext";

export default function Sidebar() {
  const themeContext = useThemeContext();
  const dataContext = useDataContext();

  return (
    <aside className="sidebar">
      <Logo theme={themeContext.theme} />
      <Heading level={4} className="sidebar__title">
        All Boards ({dataContext.datas.length})
      </Heading>
      <ul className="sidebar__list-btn">
        {dataContext.datas.map((board, index) => {
            //TODO: add classe de active para demostrar na UI qual o board atual selecionado, mas para fazer isso devemos, adicionar ids, nos boards e columns para não comparar com somente nomes
          return (
            <li className="sidebar__item" key={index}>
              <Button
                type="button"
                size="l"
                className="sidebar__btn sidebar__btn--select-board"
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
          <Button
            type="button"
            size="l"
            className="sidebar__btn sidebar__btn--create-board"
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
    </aside>
  );
}
