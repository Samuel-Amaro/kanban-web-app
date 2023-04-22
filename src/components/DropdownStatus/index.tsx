import { useRef, useState } from "react";
import {
  getFocusableElements,
  getRefs,
  nextFocusable,
  setFocusNextItem,
  setToFocus,
  setToFocusPreviousItem,
} from "../../utils";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Button from "../Button";

//TODO: add styles mobile-first

export type OptionStatus = {
  value: string;
  label: string;
  id: string;
};

interface PropsDropdown {
  options: OptionStatus[];
  onChange: (option: OptionStatus) => void; //esta function sera chamada quando um valor do dropdown for selecionado
  defaultOption: OptionStatus | null;
}

export default function DropdownStatus({
  options,
  onChange,
  defaultOption,
}: PropsDropdown) {
  const [menuDropdownIsOppen, setMenuDropdownIsOppen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionStatus | null>(
    defaultOption ? defaultOption : null
  );
  const refBtnDropdow = useRef<HTMLButtonElement | null>(null);
  const refsOptions = useRef<HTMLLIElement[] | null>(null);
  const refDropdown = useRef<HTMLUListElement | null>(null);
  const refContainerDropdown = useRef<HTMLDivElement | null>(null);

  function handleOnCloseDropdown() {
    refBtnDropdow.current?.focus();
    setMenuDropdownIsOppen(false);
  }

  function handleKeyDownBtnDropdown(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "Down":
        //abre o menu via keys
        setMenuDropdownIsOppen(true);
        //add o focus ao primeiro item do menu apos abrir
        setToFocus(0, refsOptions);
        break;
      case "Esc":
      case "Escape":
        //fecha o menu via keys
        setMenuDropdownIsOppen(false);
        //add o focus para o button sidebar apos fechar o menu
        refBtnDropdow.current?.focus();
        break;
      case "Up":
      case "ArrowUp":
        //abre o menu via keys
        setMenuDropdownIsOppen(true);
        //apos abrir menu o foco vai para o ultimo item de menu
        setToFocus(getRefs(refsOptions).length - 1, refsOptions);
        break;
      default:
        break;
    }
  }

  function handleSelect(option: OptionStatus) {
    //seleciona um button option
    setSelectedOption(option);
    //atualiza o onChange manipulador do componente pai para estar ciente de qual option action o user escolheu
    onChange(option);
    //fecha o dropdown
    handleOnCloseDropdown();
  }

  function handleKeyDownButtonOption(
    e: React.KeyboardEvent<HTMLLIElement>,
    option: OptionStatus
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
          setToFocusPreviousItem(e.currentTarget, refsOptions);
          break;
        case "ArrowDown":
        case "Down":
          setFocusNextItem(e.currentTarget, refsOptions);
          break;
        case "Home":
        case "PageUp":
          setToFocus(0, refsOptions);
          break;
        case "End":
        case "PageDown":
          setToFocus(getRefs(refsOptions).length - 1, refsOptions);
          break;
        case "Tab":
          e.preventDefault();
          nextFocusable(getFocusableElements(refDropdown.current), !e.shiftKey);
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
        id="menubutton2"
        aria-haspopup="true"
        aria-controls="menu1"
        aria-expanded={menuDropdownIsOppen ? false : true}
        aria-label="Options to actions"
        onPointerDown={() => setMenuDropdownIsOppen(!menuDropdownIsOppen)}
        onKeyDown={handleKeyDownBtnDropdown}
        ref={refBtnDropdow}
      >
        {selectedOption ? selectedOption.label : "Select a option"}
      </Button>
      {menuDropdownIsOppen && (
        <ul
          id="dropdown-listbox"
          role="listbox"
          aria-labelledby="menubutton2"
          className="dropdown-container__list"
          ref={refDropdown}
        >
          {options.map((option, index) => (
            <li
              className="dropdown-container__item-list"
              key={index}
              role="option"
              aria-selected={
                selectedOption?.value.toLowerCase() ===
                option.value.toLowerCase()
              }
              onPointerDown={() => handleSelect(option)}
              onKeyDown={(e) => handleKeyDownButtonOption(e, option)}
              tabIndex={0}
              ref={(btn) => {
                const refItems = getRefs(refsOptions);
                if (btn) {
                  refItems.push(btn);
                } else {
                  refItems.splice(0, 1);
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
