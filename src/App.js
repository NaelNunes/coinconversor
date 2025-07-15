import "./styles.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}
