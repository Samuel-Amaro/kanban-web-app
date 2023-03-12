import React, { useState, useContext } from "react";
import { Board, DataContextType } from "../../data";
import data from "../../data.json";

const DataContext = React.createContext<DataContextType | null>(null);

export default function DataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //todos os boards estão aqui para primeiro carregamento
  const [datas, setDatas] = useState<Board[]>(data.boards);
  //obtem o primeiro board via codigo, mas se tiver uma outra maneira de escolha so adpatar
  const [currentSelectedBoard, setCurrentSelectedBoard] = useState<Board>(datas[0]);

  //TODO: implementar as functions do DataContextType declaradas aqui, criar o corpo delas aqui, e especificar no value do provider
  //TODO: as functions de atualizar, deletar, e criar, tarefas, boards, subtaskas, columns, editar as mesmas, implementar cada uma delas aqui, especificando os paramentros, e atualizar o datas state com novo objetos com novos dados

  function saveBoard(board: Board) {
    //TODO: implementar logica para criar um novo board e add no contexto, e seleciona-lo para ser editado
  }


  return (
    <DataContext.Provider value={{ datas, currentSelectedBoard, setCurrentSelectedBoard }}>{children}</DataContext.Provider>
  );
}

export function useDataContext() {
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    throw new Error("Error in data context");
  }

  return dataContext;
}
