import './App.css';
import Header from "./components/header/Header";
import Dashboard from "./components/Dashboard/DashboardUser"
import Footer from "./components/Footer/Footer";
import CurrencyTable from './components/CurrencyTable/CurrencyTable';

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
