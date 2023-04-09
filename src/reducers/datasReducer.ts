import { Board } from "../data";

export type ActionTypeDatasReducer = {
    type: "save_new_board",
    board: Board
};

export function datasReducer(datas: Board[], action: ActionTypeDatasReducer) {
    switch(action.type) {
        case "save_new_board": {
            return [
                ...datas,
                action.board
            ];
        };
        default: {
            throw Error("Unknown action datas");
        }
    }
}