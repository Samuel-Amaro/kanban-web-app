import Logo from "../Icons/Logo";
import { useThemeContext } from "../context/ThemeContext";

export default function Sidebar() {

    const themeContext = useThemeContext();

    return (
        <aside className="sidebar">
            <Logo theme={themeContext.theme}/>

        </aside>
    );    
}