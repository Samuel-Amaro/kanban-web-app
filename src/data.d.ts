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
    selectedIdBoard: string;
    updateIdSelectedBoard: (idBoard: string) => void;
};