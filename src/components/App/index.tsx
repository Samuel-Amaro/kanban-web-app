import React, {useState} from "react";
import DataContextProvider from "../context/DataContext";
import { ThemeContextProvider } from "../context/ThemeContext";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./App.css";

function App() {

  //este state controla de a sidebar esta oculta ou não, os componentes como header e sidebar usam ele
  //porque no desktop e tables componente sidebar usa o state, no mobile dispositivo, o header usa o componente
  const [isHidden, setIsHidden] = useState(false);

  return (
    <ThemeContextProvider>
      <DataContextProvider>
        <Header />
        <Sidebar />
      </DataContextProvider>
    </ThemeContextProvider>
  );
}

export default App;