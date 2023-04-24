import { nanoid } from "nanoid";
import { Task } from "../data";

export type ActionType = { type: "save_task"; idBoard: string; idColumn: string; task: Task};

export function boardReducer(state: Task, action: ActionType) {
    switch(action.type) {
        case "save_task":
            break;
        default: {
            throw Error("Unknown action task");
        }
    }
}