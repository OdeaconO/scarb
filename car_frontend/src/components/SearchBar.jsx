import { useEffect, useRef, useState, useContext } from "react";
import FilterContext from "../contexts/FilterContext.jsx";

export default function SearchBar() {
  const { filters: globalFilters, setFilters: setGlobalFilters } =
    useContext(FilterContext);

  // local UI copy of filters — only applied to global when user clicks Apply
  const [local, setLocal] = useState(globalFilters);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // keep local in sync if global filters changed elsewhere
  useEffect(() => setLocal(globalFilters), [globalFilters]);

  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return;
      if (e.type === "keydown" && e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.type === "click" && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onDoc);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onDoc);
    };
  }, []);

  function handleLocalChange(e) {
    const { name, value } = e.target;
    setLocal((p) => ({ ...p, [name]: value }));
  }

  function submitSearch(e) {
    e.preventDefault();
    // apply search string into global filters.q
    setGlobalFilters((p) => ({ ...p, q: local.q ?? "" }));
  }

  function applyFilters() {
    // Map bodyStyle -> bodyStyle (we'll map to body_style on the API side in HomePage)
    setGlobalFilters((p) => ({ ...p, ...local }));
    setIsOpen(false);
  }

  function resetLocal() {
    const reset = {
      q: "",
      brand: "",
      model: "",
      year: "",
      seating: "",
      transmission: "",
      bodyStyle: "",
    };
    setLocal(reset);
    setGlobalFilters(reset);
  }

  return (
    <div ref={containerRef} style={{ position: "relative", minWidth: 0 }}>
      <form
        onSubmit={submitSearch}
        style={{
          display: "flex",
          gap: "6px",
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <input
          name="q"
          type="text"
          className="nes-input"
          placeholder="Search…"
          value={local.q ?? ""}
          onChange={handleLocalChange}
          style={{ flex: "1 1 180px", minWidth: 0 }}
        />
        <button
          type="submit"
          className="nes-btn is-primary"
          aria-label="Search"
        >
          Search
        </button>

        <button
          type="button"
          className="nes-btn"
          onClick={() => setIsOpen((s) => !s)}
          aria-expanded={isOpen}
          aria-controls="filter-island"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          Filter
        </button>
      </form>

      {isOpen && (
        <div
          id="filter-island"
          className="filter-island nes-container is-dark"
          role="dialog"
          aria-modal="false"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 360,
            maxWidth: "92vw",
            zIndex: 150,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              name="brand"
              placeholder="Brand"
              value={local.brand ?? ""}
              onChange={handleLocalChange}
              className="nes-input"
            />
            <input
              name="model"
              placeholder="Model"
              value={local.model ?? ""}
              onChange={handleLocalChange}
              className="nes-input"
            />
            <input
              name="year"
              placeholder="Year"
              value={local.year ?? ""}
              onChange={handleLocalChange}
              className="nes-input"
              type="number"
            />

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <select
                className="nes-select"
                name="seating"
                value={local.seating ?? ""}
                onChange={handleLocalChange}
                style={{ flex: "1 1 100px", minWidth: 0 }}
              >
                <option value="" disabled hidden>
                  Seating
                </option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7">7</option>
              </select>

              <select
                className="nes-select"
                name="transmission"
                value={local.transmission ?? ""}
                onChange={handleLocalChange}
                style={{ flex: "1 1 120px", minWidth: 0 }}
              >
                <option value="" disabled hidden>
                  Transmission
                </option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <select
              className="nes-select"
              name="bodyStyle"
              value={local.bodyStyle ?? ""}
              onChange={handleLocalChange}
            >
              <option value="" disabled hidden>
                Body Style
              </option>
              <option value="coupe">Coupe</option>
              <option value="sedan">Sedan</option>
              <option value="hatch">Hatch</option>
              <option value="suv">SUV</option>
              <option value="pickup">Pickup</option>
              <option value="crossover">Crossover</option>
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <button type="button" className="nes-btn" onClick={resetLocal}>
                Reset
              </button>
              <button
                type="button"
                className="nes-btn is-primary"
                onClick={applyFilters}
              >
                Apply
              </button>
              <button
                type="button"
                className="nes-btn"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
