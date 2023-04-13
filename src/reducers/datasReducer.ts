import { Board } from "../data";

export type ActionTypeDatasReducer = 
    {type: "save_new_board", board: Board} 
    | {type: "edit_board", board: Board} 
    | { type: "delete_board"; idBoard: string };;

export function datasReducer(datas: Board[], action: ActionTypeDatasReducer) {
    switch(action.type) {
        case "save_new_board": {
            return [
                ...datas,
                action.board
            ];
        };
        case "edit_board": {
            return datas.map((b) => {
                if(b.id === action.board.id) {
                    return action.board;
                }
                return b;
            });
        };
        case "delete_board": {
            return datas.filter((b) => {
                return b.id !== action.idBoard
            });
        };
        default: {
            throw Error("Unknown action datas");
        }
    }
}