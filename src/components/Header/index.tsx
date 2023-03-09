import Heading from "../Heading";

export default function Header() {
    return(
        <header className="header">
            <Heading level={1} className="header__name-board">Name Board</Heading>
        </header>
    );
}