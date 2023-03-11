export interface Board {
    name: string;
    columns: Column[];
};

export interface Column {
    name: string;
    tasks: Task[];
};

export interface Task {
    title: string;
    description: string;
    status: string;
    subtasks: Subtask[];
};

export interface Subtask {
    title: string;
    isCompleted: boolean;
};

export type DataContextType = {
    datas: Board[];
    //functions de atualizar quadro, tarefas, subtarefas, criar novos quadros, criar novas tarefas, subtarefas
};