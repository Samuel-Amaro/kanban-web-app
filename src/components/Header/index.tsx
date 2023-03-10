import Button from "../Button";
import Heading from "../Heading";
import VerticalEllipsis from "../Icons/VerticalEllipsis";

export default function Header() {
    return(
        <header className="header">
            <Heading level={1} className="header__name-board">Name Board</Heading>
            <div className="header__container">
                <Button type="button" size="l" variant="primary">+ Add New Task</Button>
                <VerticalEllipsis />
            </div>
        </header>
    );
}