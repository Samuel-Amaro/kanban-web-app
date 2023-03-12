import React from "react";

//TODO: adicionar index nas tarefas e subtarefas e se precisar nas colunas e boards para ajudar em filtragem e rastreio
//TODO: instalar uuid para adicionar index exclusvisos e ordenar todos os dados para que ajude em filtragem e busca

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
    currentSelectedBoard: Board;
    setCurrentSelectedBoard: React.Dispatch<React.SetStateAction<Board>>;
    //TODO: functions de atualizar quadro, tarefas, subtarefas, criar novos quadros, criar novas tarefas, subtarefas, editar , aqui somente especificamos a declarações das functions, e oque elas retornar
    //TODO 1: primeira function a criar e a de criar novo board, e apos criar ele o seleciona-lo para ser atualmente preenchido
    //saveBoard: (board: Board) => void;
};