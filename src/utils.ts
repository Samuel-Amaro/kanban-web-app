import { Board } from "./data";

/**
 * esta function encontrar elementos que podem receber foco dentro de um elemento pai certificando-se de excluir qualquer coisa com tabindex=-1. Também classificamos os elementos para seguir a ordem
 * 
 * https://zellwk.com/blog/keyboard-focusable-elements/
 * 
 * @param parent 
 * @returns 
 */
export function getFocusableElements(parent?: HTMLElement | null) : HTMLElement[] {
    if (!parent) return [];

  return (
    Array.from(parent.querySelectorAll("a[href], button, input, textarea, select, details,[tabindex]"))
      .filter(
        (el) => el.getAttribute("tabindex") !== "-1" && !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      )
      // sort tabindexes as follows: 1, 2, 3, 4, ..., 0, 0, 0
      .sort((a, b) => {
        const aIndex = Number(a.getAttribute("tabindex")) ?? 0;
        const bIndex = Number(b.getAttribute("tabindex")) ?? 0;
        if (aIndex === bIndex) return 0;
        if (aIndex === 0) return 1;
        if (bIndex === 0) return -1;
        return aIndex < bIndex ? -1 : 1;
      }) as HTMLElement[]
  );
}

/**
 * esta function percorre um determinado array de elementos que podem receber focus
 * 
 * https://blog.bitsrc.io/simple-accessible-modal-in-react-typescript-and-tailwind-3296704a985a
 * 
 * @param elements 
 * @param forward 
 */
export function nextFocusable(elements: HTMLElement[], forward = true) {
    const currentIndex = elements.findIndex((e) => e === document.activeElement);
  let nextIndex = 0;

  if (currentIndex > -1) {
    if (forward) {
      nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
    }
  }

  elements[nextIndex]?.focus();
}

type DataErrorFieldColumn = {
  id: string;
  error: string;
};

export type DataErrorBoard = {
  nameBoard: string | undefined;
  columns: DataErrorFieldColumn[];
};

export function validationFormBoard(fields: Board) {
  const errors: DataErrorBoard = { nameBoard: undefined, columns: []};

  if(fields.name.trim() === "") {
    errors.nameBoard = "Can’t be empty";
  }
  
  for(const value of fields.columns) {
    if(value.name.trim() === "") {
      errors.columns.push({id: value.id, error: "Can’t be empty"});
    }
  }

  return errors;
}

export function formBoardIsValid(errors: DataErrorBoard) {
  if (errors.nameBoard || errors.columns.length > 0) return false;
  return true;
}