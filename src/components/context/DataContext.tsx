import React, { useState, useContext } from "react";
import { Board, DataContextType} from "../../data";
import data from "../../data.json";

const DataContext = React.createContext<DataContextType | null>(null);

export function DataProvider({children}: {children: React.ReactNode}) {
  const [datas, setDatas] = useState<Board[]>(data.boards);

  //TODO: implementar as functions do DataContextType declaradas aqui, criar o corpo delas aqui, e especificar no value do provider
  //TODO: as functions de atualizar, deletar, e criar, tarefas, boards, subtaskas, columns, editar as mesmas, implementar cada uma delas aqui, especificando os paramentros, e atualizar o datas state com novo objetos com novos dados

  return (
    <DataContext.Provider value={{ datas }}>{children}</DataContext.Provider>
  );
}

export function useDataContext() {
     const dataContext = useContext(DataContext);

    if(!dataContext) {
        throw new Error("Error in data context");
    }

    return dataContext;
}

