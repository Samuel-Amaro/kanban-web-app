import { Board, Task } from "../data";

export type ActionTypeDatasReducer = 
    {type: "save_new_board", board: Board} 
    | {type: "edit_board", board: Board} 
    | { type: "delete_board"; idBoard: string }
    | {type: "changed_status_subtask"; idBoard: string; idColumn: string; idTask: string; idSubtask: string; newStatusSubtask: boolean} 
    | {type: "changed_status_task"; idBoard: string; sourceColumnId: string; idTask: string; newStatusTask: string; targetColumnId: string}
    | {type: "save_new_task", task: Task, idBoard: string; idColumn: string}
    | {type: "edit_task", taskChanged: Task, idBoard: string, idColumn: string}
    | {type: "delete_task", idBoard: string; idColumn: string; idTask: string}
    | {type: "changed_status_task_and_add_new_position", idBoard: string; sourceColumnId: string; idTask: string; newStatusTask: string; targetColumnId: string, newIndexPosition: number}
    | {type: "changed_position_task", idTaskToPosition: string, idReferenceTaskForPlacement: string | null, idBoard: string; idColumn: string};

export function datasReducer(draft: Board[], action: ActionTypeDatasReducer) {
    switch (action.type) {
      case "save_new_board": {
        draft.push(action.board);
        break;
      }
      case "edit_board": {
        const indexBoardChanged = draft.findIndex(
          (board) => board.id === action.board.id
        );
        if (indexBoardChanged > -1) {
          draft.splice(indexBoardChanged, 1, action.board);
        }
        break;
      }
      case "delete_board": {
        const indexBoardToBeDeleted = draft.findIndex(
          (board) => board.id === action.idBoard
        );
        if (indexBoardToBeDeleted > -1) {
          draft.splice(indexBoardToBeDeleted, 1);
        }
        break;
      }
      case "changed_status_subtask": {
        const indexBoard = draft.findIndex(
          (board) => board.id === action.idBoard
        );
        const indexColumn = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.idColumn
        );
        const indexTask = draft[indexBoard].columns[
          indexColumn
        ].tasks.findIndex((task) => task.id === action.idTask);
        const indexSubtask = draft[indexBoard].columns[indexColumn].tasks[
          indexTask
        ].subtasks.findIndex((subtask) => subtask.id === action.idSubtask);
        if (
          indexBoard > -1 &&
          indexColumn > -1 &&
          indexTask > -1 &&
          indexSubtask > -1
        ) {
          draft[indexBoard].columns[indexColumn].tasks[indexTask].subtasks[
            indexSubtask
          ].isCompleted = action.newStatusSubtask;
        }
        break;
      }
      case "changed_status_task": {
        const indexBoard = draft.findIndex(
          (board) => board.id === action.idBoard
        );
        const indexColumnSource = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.sourceColumnId
        );
        const indexTask = draft[indexBoard].columns[
          indexColumnSource
        ].tasks.findIndex((task) => task.id === action.idTask);
        const indexColumnTarget = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.targetColumnId
        );
        if (
          indexBoard > -1 &&
          indexColumnSource > -1 &&
          indexTask > -1 &&
          indexColumnTarget > -1
        ) {
          const task =
            draft[indexBoard].columns[indexColumnSource].tasks[indexTask];
          task.status = action.newStatusTask;
          //remove task column source
          draft[indexBoard].columns[indexColumnSource].tasks.splice(
            indexTask,
            1
          );
          //add task column target
          draft[indexBoard].columns[indexColumnTarget].tasks.push(task);
        }
        break;
      }
      case "save_new_task": {
        const indexBoard = draft.findIndex(
          (board) => board.id === action.idBoard
        );
        const indexColumn = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.idColumn
        );
        if (indexBoard > -1 && indexColumn > -1) {
          draft[indexBoard].columns[indexColumn].tasks.push(action.task);
        }
        break;
      }
      case "edit_task": {
        const indexBoard = draft.findIndex(
          (board) => board.id === action.idBoard
        );
        const indexColumn = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.idColumn
        );
        const indexTaskChanged = draft[indexBoard].columns[
          indexColumn
        ].tasks.findIndex((task) => task.id === action.taskChanged.id);
        if (indexBoard > -1 && indexColumn > -1 && indexTaskChanged > -1) {
          draft[indexBoard].columns[indexColumn].tasks.splice(
            indexTaskChanged,
            1,
            action.taskChanged
          );
        }
        break;
      }
      case "delete_task": {
        const indexBoard = draft.findIndex(
          (board) => board.id === action.idBoard
        );
        const indexColumn = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.idColumn
        );
        const indexTaskToBeDeleted = draft[indexBoard].columns[
          indexColumn
        ].tasks.findIndex((task) => task.id === action.idTask);
        if (indexBoard > -1 && indexColumn > -1 && indexTaskToBeDeleted > -1) {
          draft[indexBoard].columns[indexColumn].tasks.splice(
            indexTaskToBeDeleted,
            1
          );
        }
        break;
      }
      case "changed_status_task_and_add_new_position": {
        const indexBoard = draft.findIndex(
          (board) => board.id === action.idBoard
        );
        const indexColumnSource = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.sourceColumnId
        );
        const indexTask = draft[indexBoard].columns[
          indexColumnSource
        ].tasks.findIndex((task) => task.id === action.idTask);
        const indexColumnTarget = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.targetColumnId
        );
        if (
          indexBoard > -1 &&
          indexColumnSource > -1 &&
          indexTask > -1 &&
          indexColumnTarget > -1
        ) {
          const task =
            draft[indexBoard].columns[indexColumnSource].tasks[indexTask];
          task.status = action.newStatusTask;
          //remove task column source
          draft[indexBoard].columns[indexColumnSource].tasks.splice(
            indexTask,
            1
          );
          //add task column target, in position specifi
          draft[indexBoard].columns[indexColumnTarget].tasks.splice(action.newIndexPosition, 0, task);
        }
        break;
      }
      case "changed_position_task": {
        const indexBoard = draft.findIndex(
          (board) => board.id === action.idBoard
        );
        const indexColumn = draft[indexBoard].columns.findIndex(
          (column) => column.id === action.idColumn
        );
        const indexTaskToPositionInitial = draft[indexBoard].columns[
          indexColumn
        ].tasks.findIndex((task) => task.id === action.idTaskToPosition);
        if(indexBoard > -1 && indexColumn > -1 && indexTaskToPositionInitial > -1) {
            //remove do array a task a ser reposicionada
            if(action.idReferenceTaskForPlacement) {
                //add a task novamente em uma position especifica
                //procura index da task reference
                const indexTaskReferenceForReplacement = draft[indexBoard].columns[
                indexColumn
                ].tasks.findIndex((task) => task.id === action.idReferenceTaskForPlacement);
                if(indexTaskReferenceForReplacement > -1) {
                    draft[indexBoard].columns[indexColumn].tasks.splice(indexTaskReferenceForReplacement, 0, draft[indexBoard].columns[indexColumn].tasks.splice(indexTaskToPositionInitial, 1)[0]);
                    break;
                }
            }else{
              //add a task novamente no inicio
              draft[indexBoard].columns[indexColumn].tasks.splice(0, 0, draft[indexBoard].columns[indexColumn].tasks.splice(indexTaskToPositionInitial, 1)[0]);
              break;
            }
        }
        break;
      };
      default: {
        throw Error("Unknown action datas");
      }
    }
}
