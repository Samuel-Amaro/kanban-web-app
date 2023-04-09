export interface Board {
    id: string;
    name: string;
    columns: Column[];
};

export interface Column {
    id: string;
    name: string;
    tasks: Task[];
};

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    subtasks: Subtask[];
};

export interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
};

export type DataContextType = {
    datas: Board[];
    selectedBoard: Board;
    updateSelectedBoard: (boardToSelected: Board) => void;
    //TODO: functions de atualizar quadro, tarefas, subtarefas, criar novos quadros, criar novas tarefas, subtarefas, editar , aqui somente especificamos a declarações das functions, e oque elas retornar
    //TODO 1: primeira function a criar e a de criar novo board, e apos criar ele o seleciona-lo para ser atualmente preenchido
    //saveBoard: (board: Board) => void;
};