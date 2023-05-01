import React, { useState, useContext, createContext, useEffect } from "react";
import { Board, DataContextType } from "../data";
import data from "../data.json";
import { ActionTypeDatasReducer, datasReducer } from "../reducers/datasReducer";
import { useImmerReducer } from "use-immer";

const DataContext = React.createContext<DataContextType | null>(null);

const DataDispatchContext =
  createContext<React.Dispatch<ActionTypeDatasReducer> | null>(null);

export default function DataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const datasLocalStorage = localStorage.getItem("datas");
  const idBoardSelectedLocalStorage = localStorage.getItem("idBoardSelected");

  const [datas, dispatch] = useImmerReducer(
    datasReducer,
    datasLocalStorage ? (JSON.parse(datasLocalStorage) as Board[]) : data.boards
  );

  const [selectedIdBoard, setSelectedIdBoard] = useState<string>(
    datas.length > 0 && idBoardSelectedLocalStorage
      ? idBoardSelectedLocalStorage
      : datas.length > 0 && idBoardSelectedLocalStorage === null
      ? datas[0].id
      : ""
  );

  function updateIdSelectedBoard(idBoard: string) {
    setSelectedIdBoard(idBoard);
  }

  useEffect(() => {
    localStorage.setItem("datas", JSON.stringify(datas));
  }, [datas]);

  useEffect(() => {
    localStorage.setItem("idBoardSelected", selectedIdBoard);
  }, [selectedIdBoard]);

  return (
    <DataContext.Provider
      value={{
        datas,
        selectedIdBoard,
        updateIdSelectedBoard,
      }}
    >
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    throw new Error("Error in data context");
  }

  return dataContext;
}

export function useDatasDispatch() {
  const dispacthContext = useContext(DataDispatchContext);
  if (!dispacthContext) {
    throw Error("Context dispatch datas error");
  }
  return dispacthContext;
}
