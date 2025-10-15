import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <nav
      className="nes-container is-dark"
      style={{ position: "fixed", width: "100%", top: 0, zIndex: 99 }}
    >
      <div
        className="nav-inner"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/account" style={{ margin: "0 8px" }}>
            Account
          </Link>
          <Link to="/sell">Sell</Link>
        </div>

        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
