import { useRef, useState } from "react";
import Button from "../Button";
import VerticalEllipsis from "../Icons/VerticalEllipsis";
import {
  getFocusableElements,
  getRefs,
  nextFocusable,
  setFocusNextItem,
  setToFocus,
  setToFocusPreviousItem,
} from "../../utils";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import "./Dropdown.css";
import React from "react";

export type Option = {
  value: string;
  label: string;
};

interface PropsDropdown {
  options: Option[];
  onChange: (value: string) => void; 
  className?: string;
}

const DropdownMenu = React.forwardRef<HTMLButtonElement, PropsDropdown>(
  function DropdownMenu(props, ref) {
    const [menuDropdownIsOppen, setMenuDropdownIsOppen] = useState(false);
    const refsButtonsOptions = useRef<HTMLButtonElement[] | null>(null);
    const refDropdown = useRef<HTMLUListElement | null>(null);
    const refContainerDropdown = useRef<HTMLDivElement | null>(null);

    function handleOnCloseDropdown() {
      setMenuDropdownIsOppen(false);
    }

    function handleKeyDownBtnDropdown(
      e: React.KeyboardEvent<HTMLButtonElement>
    ) {
      switch (e.key) {
        case " ":
        case "Enter":
        case "ArrowDown":
        case "Down":
          //abre o menu via keys
          setMenuDropdownIsOppen(true);
          //add o focus ao primeiro item do menu apos abrir
          setToFocus(0, refsButtonsOptions);
          break;
        case "Esc":
        case "Escape":
          //fecha o menu via keys
          setMenuDropdownIsOppen(false);
          //add o focus para o button sidebar apos fechar o menu
          //refBtnDropdow.current?.focus();
          break;
        case "Up":
        case "ArrowUp":
          //abre o menu via keys
          setMenuDropdownIsOppen(true);
          //apos abrir menu o foco vai para o ultimo item de menu
          setToFocus(
            getRefs(refsButtonsOptions).length - 1,
            refsButtonsOptions
          );
          break;
        default:
          break;
      }
    }

    function handleSelect(option: Option) {
      //atualiza o onChange manipulador do componente pai para estar ciente de qual option action o user escolheu
      props.onChange(option.value);
      //fecha o dropdown
      handleOnCloseDropdown();
    }

    function handleKeyDownButtonOption(
      e: React.KeyboardEvent<HTMLButtonElement>,
      option: Option
    ) {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      } else {
        switch (e.key) {
          case "Esc":
          case "Escape":
            handleOnCloseDropdown();
            break;
          case "Up":
          case "ArrowUp":
            setToFocusPreviousItem(e.currentTarget, refsButtonsOptions);
            break;
          case "ArrowDown":
          case "Down":
            setFocusNextItem(e.currentTarget, refsButtonsOptions);
            break;
          case "Home":
          case "PageUp":
            setToFocus(0, refsButtonsOptions);
            break;
          case "End":
          case "PageDown":
            setToFocus(
              getRefs(refsButtonsOptions).length - 1,
              refsButtonsOptions
            );
            break;
          case "Tab":
            e.preventDefault();
            nextFocusable(
              getFocusableElements(refDropdown.current),
              !e.shiftKey
            );
            break;
          case " ":
          case "Enter":
            e.preventDefault();
            handleSelect(option);
            break;
          default:
            break;
        }
      }
    }

    useOnClickOutside({
      ref: refContainerDropdown,
      handle: handleOnCloseDropdown,
    });

    return (
      <div className="dropdown-container" ref={refContainerDropdown}>
        <Button
          type="button"
          className="dropdown-container__btn"
          title={menuDropdownIsOppen ? "Hidden options" : "Show options"}
          id="menubutton1"
          aria-haspopup="true"
          aria-controls="menu1"
          aria-expanded={menuDropdownIsOppen ? false : true}
          aria-label="Options to actions"
          onPointerDown={() => setMenuDropdownIsOppen(!menuDropdownIsOppen)}
          onKeyDown={handleKeyDownBtnDropdown}
          ref={/*refBtnDropdow*/ ref}
        >
          <VerticalEllipsis className="dropdown-container__icon" />
        </Button>
        {menuDropdownIsOppen && (
          <ul
            id="menu1"
            role="menu"
            aria-labelledby="menubutton1"
            className={
              props.className
                ? `dropdown-container__list ${props.className}`
                : "dropdown-container__list"
            }
            ref={refDropdown}
          >
            {props.options.map((option, index) => (
              <li
                className="dropdown-container__item-list"
                key={index}
                role="none"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="dropdown-container__option-btn"
                  title={`Option ${option.label}`}
                  aria-label={option.label}
                  ref={(btn) => {
                    const refItems = getRefs(refsButtonsOptions);
                    if (btn) {
                      refItems.push(btn);
                    } else {
                      refItems.splice(0, 1);
                    }
                  }}
                  onPointerDown={() => handleSelect(option)}
                  onKeyDown={(e) => handleKeyDownButtonOption(e, option)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

export default DropdownMenu;


