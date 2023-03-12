import { useThemeContext } from "../context/ThemeContext";

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
    <div
      className="switch"
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
        className="switch-controler"
        aria-label="Switch Controller to switch themes"
        title="Switch Controller to switch themes"
      ></span>
    </div>
  );
}
