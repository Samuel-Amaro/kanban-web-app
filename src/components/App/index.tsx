import DataContextProvider from "../context/DataContext";
import { ThemeContextProvider } from "../context/ThemeContext";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./App.css";

function App() {
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
