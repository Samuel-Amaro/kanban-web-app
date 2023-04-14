import React, { useState, useContext, createContext, useReducer } from "react";
import { DataContextType } from "../data";
import data from "../data.json";
import { ActionTypeDatasReducer, datasReducer } from "../reducers/datasReducer";

//este context fornece os datas para app
const DataContext = React.createContext<DataContextType | null>(null);

//este context force a function que permite aos componentes despachar(dispatch) actions do usuario para a function reducer, onde esta definida a logica de atualização do state
const DataDispatchContext =
  createContext<React.Dispatch<ActionTypeDatasReducer> | null>(null);

export default function DataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //todos os boards estão aqui para primeiro carregamento
  const [datas, dispatch] = useReducer(datasReducer, data.boards);

  //TODO: SE TIVER OUTRA FORMA DE ESCOLHER O BOARD SELECTED NO PRIMEIRO CARREGAMENTO ESPECIFICAR AQUI
  //TODO: AO ATUALIZAR DATAS, TEM QUE REFLETIR EM SELECTED BOARD, SÃO DOIS ESTADOS DIFERENTES MAS TEM QUE ESTAR SINCRONIZADOS
  //TODO: AO REMOVER UM BOARD DE DATAS TEMOS QUE VERIFICAR SE NÃO REMOVEMOS O ATUAL SELECIONADO
  //TODO: AO REMOVER UM BOARD TEMOS QUE AUTOMATICAMENTE JA SELECIONAR OUTRO INSTANTANEMANTE E DEIXAR SINCRONIZADO COM A UI
  //TODO: AU ATUAILIZAR BOARD SELECTED TEMOS QUE ATUALIZAR EM DATAS E SELECTED BOARD PARA ESTAR SINCRONIZAZDO
  //TODO: COLOCAR NESTE STATE SOMENTE PARA RECEBER O ID, DO BOARD SELECTED, E ATUALIZAR O BOARD SEMPRE EM DATAS, E NÃO AQUI, AQUI SO VAMOS MANTER O ID DO BOARD SELECTED PARA NÃO TER QUE SINCRONIZAR OS DOIS STATES
  //obtem o primeiro board via codigo, mas se tiver uma outra maneira de escolha so adpatar
  const [selectedIdBoard, setSelectedIdBoard] = useState<string>(
    datas.length > 0 ? datas[0].id : ""
  );

  function updateIdSelectedBoard(idBoard: string) {
    setSelectedIdBoard(idBoard);
  }

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
