import DarkTheme from "../Icons/DarkTheme";
import LightTheme from "../Icons/LightTheme";
import { useThemeContext } from "../context/ThemeContext";
import "./Switch.css";

export default function Switch() {
  const themeContext = useThemeContext();

  function toggleStatus(
    event:
      | React.PointerEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) {
    let state = "";
    if (event.currentTarget.getAttribute("aria-checked") === "true") {
      state = "false";
    } else {
      state = "true";
    }
    event.currentTarget.setAttribute("aria-checked", state);
  }

  return (
    <div className="switch">
      <div className="switch__container">
        <LightTheme className="switch__icon" />
        <div
          className="switch__wrapper"
          role="switch"
          aria-checked={themeContext.theme === "light" ? false : true}
          onPointerDown={(event) => {
            toggleStatus(event);
            themeContext.setTheme(
              event.currentTarget.getAttribute("aria-checked") === "true"
                ? "dark"
                : "light"
            );
          }}
          aria-label="Site cores scheme switcher"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              toggleStatus(event);
              themeContext.setTheme(
                event.currentTarget.getAttribute("aria-checked") === "true"
                  ? "dark"
                  : "light"
              );
            }
          }}
          tabIndex={0}
          title="Toggle Theme"
        >
          <span
            className="switch__controler"
            aria-label="Switch Controller to switch themes"
            title="Switch Controller to switch themes"
          ></span>
        </div>
        <DarkTheme className="switch__icon" />
      </div>
    </div>
  );
}
