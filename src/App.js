import "./App.css";
import Header from "./components/header/header";
import Dashboard from "./components/dashboard/DashboardUser";
import Footer from "./components/footer/Footer";
import CurrencyTable from "./components/CurrencyTable/CurrencyTable";

function App() {
  return (
    <div className="App">
      <Header />
      <Dashboard />
      <CurrencyTable />

      <Footer className="footer" />
    </div>
  );
}

export default App;
