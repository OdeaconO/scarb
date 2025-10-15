// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SellPage from "./pages/SellPage.jsx";
import BuyPage from "./pages/BuyPage.jsx";
import AccountPage from "./components/AccountPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import { FilterProvider } from "./contexts/FilterContext.jsx";

function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <Router>
          <Navbar />
          <div style={{ marginTop: "90px" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/buy/:carId" element={<BuyPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </div>
        </Router>
      </FilterProvider>
    </AuthProvider>
  );
}

export default App;
