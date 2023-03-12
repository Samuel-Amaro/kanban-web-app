import Button from "../Button";
import Heading from "../Heading";
import ChevronDown from "../Icons/ChevronDown";
import LogoMobile from "../Icons/LogoMobile";
import VerticalEllipsis from "../Icons/VerticalEllipsis";
import { useDataContext } from "../context/DataContext";

//TODO: ADICIONAR LOGICA DE ESTADO

export default function Header() {
  const dataContext = useDataContext();
  return (
    <header className="header">
      {/*mostrar somente a partir de dispositivos como tablets e desktops*/}
      <Heading level={1} className="header__name-board">
        {dataContext.currentSelectedBoard.name}
      </Heading>
      {/*mostrar somente em layout mobile*/}
      <div className="header__group">
        <LogoMobile />
        <div className="header__container">
          <Heading level={1} className="header__name-board">
            {dataContext.currentSelectedBoard.name}
          </Heading>
          <ChevronDown />
        </div>
      </div>
      {/*--------*/}
      <div className="header__container">
        <Button type="button" size="l" variant="primary" title="Add New Task">
          + Add New Task
        </Button>
        {/*//TODO: ADICIONAR INTERATIVIDADE VIA MOUSE E TECLADO*/}
        {/*button menu to actions board*/}
        <div className="header__menu-button-board">
          <button
            type="button"
            className="header__btn-board"
            title="Show options for current board"
            id="menubutton1"
            aria-haspopup="true"
            aria-controls="menu1"
          >
            <VerticalEllipsis />
          </button>
          <ul
            id="menu1"
            role="menu"
            aria-labelledby="menubutton1"
            className="header__menu-board"
          >
            <li role="menuitem" className="header__menu-item">
              Edit Board
            </li>
            <li role="menuitem" className="header__menu-item">
              Delete Board
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
