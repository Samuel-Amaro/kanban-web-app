import { Board } from "../data";

export type ActionTypeDatasReducer = {
    type: "save_new_board",
    board: Board
} | {type: "edit_board", board: Board};

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
        default: {
            throw Error("Unknown action datas");
        }
    }
}