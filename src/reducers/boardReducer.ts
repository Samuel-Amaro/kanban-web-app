import { nanoid } from "nanoid";
import { Board } from "../data";

export type ActionType =
    | { type: "changed_name_board"; newNameBoard: string }
    | { type: "changed_name_column"; idColumn: string; newNameColumn: string }
    | { type: "removed_column"; idColumn: string }
    | { type: "add_new_column" }

export function boardReducer(state: Board, action: ActionType) {
    switch(action.type) {
        case "changed_name_board": {
            return {
                ...state,
                name: action.newNameBoard,
            };
        }
        case "changed_name_column": {
            return {
                ...state,
                columns: state.columns.map((c) => {
                    if (c.id === action.idColumn) {
                        return {
                            ...c,
                            name: action.newNameColumn,
                        };
                    }
                    return c;
                }),
            };
        }
        case "removed_column": {
            return {
                ...state,
                columns: state.columns.filter((c) => c.id !== action.idColumn),
            };
        }
        case "add_new_column": {
            return {
                ...state,
                columns: [
                    ...state.columns,
                    {   id: `column-${nanoid(5)}`, 
                        name: "", 
                        tasks: [] 
                    },
                ],
            };
        }
        default: {
            throw Error("Unknown action");
        }
    }
}