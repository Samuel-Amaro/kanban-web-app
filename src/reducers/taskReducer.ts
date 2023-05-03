import { nanoid } from "nanoid";
import { Subtask, Task } from "../data";

export type ActionType =
    | { type: "handle_changed_title"; newTitle: string }
    | { type: "handle_changed_description"; newDescription: string }
    | {
        type: "handle_changed_title_subtask";
        newTitleSubtask: string;
        subtask: Subtask;
      }
    | {type: "handle_removed_subtask", idSubtask: string}
    | {type: "handle_add_subtask"}
    | {type: "handle_status_task", status: string};

export function taskReducer(state: Task, action: ActionType) {
    switch (action.type) {
      case "handle_changed_title":
        return {
          ...state,
          title: action.newTitle,
        };
      case "handle_changed_description":
        return {
          ...state,
          description: action.newDescription,
        };
      case "handle_changed_title_subtask":
        return {
          ...state,
          subtasks: state.subtasks.map((sub) => {
            if (sub.id === action.subtask.id) {
              return {
                ...sub,
                title: action.newTitleSubtask,
              };
            }
            return sub;
          }),
        };
      case "handle_removed_subtask":
        return {
          ...state,
          subtasks: state.subtasks.filter((sub) => sub.id !== action.idSubtask),
        };
      case "handle_add_subtask":
        return {
          ...state,
          subtasks: [
            ...state.subtasks,
            {
              id: `subtask-${nanoid(5)}`,
              title: "",
              isCompleted: false,
            },
          ],
        };
      case "handle_status_task":
        return {
            ...state,
            status: action.status
        }; 
      default: {
        throw Error("Unknown action task");
      }
    }
}