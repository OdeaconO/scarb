import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import Pagination from "../components/Pagination";
import FilterContext from "../contexts/FilterContext.jsx";
import CarCard from "../components/CarCard.jsx";

export default function HomePage() {
  const { filters } = useContext(FilterContext);
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  // map front-end filter keys to API/query keys expected by backend
  function buildParams(pageNum, filtersObj) {
    const params = { page: pageNum };
    if (filtersObj.q) params.q = filtersObj.q;
    if (filtersObj.brand) params.brand = filtersObj.brand;
    if (filtersObj.model) params.model = filtersObj.model;
    if (filtersObj.year) params.year = filtersObj.year;
    if (filtersObj.seating) params.seating = filtersObj.seating;
    if (filtersObj.transmission) params.transmission = filtersObj.transmission;
    // backend column is body_style
    if (filtersObj.bodyStyle) params.body_style = filtersObj.bodyStyle;
    return params;
  }

  useEffect(() => {
    // when filters change, reset to first page
    setPage(1);
  }, [filters]);

  useEffect(() => {
    // debounce fetch (300ms)
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // cancel previous request if any
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const params = buildParams(page, filters);

      axios
        .get("/api/cars", { params, signal: controller.signal })
        .then((res) => {
          // expecting res.data { cars: [...], total: <num> } (same shape as before)
          setCars(res.data.cars || []);
          setTotal(res.data.total || 0);
        })
        .catch((err) => {
          if (axios.isCancel?.(err)) return;
          if (err.name === "CanceledError") return;
          console.error("Failed to fetch cars", err);
        });
    }, 300);

    return () => {
      clearTimeout(debounceRef.current);
      // keep abortRef so the currently scheduled fetch can be canceled by next run
    };
  }, [filters, page]);

  const pageCount = Math.max(1, Math.ceil(total / 16));

  return (
    <div>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {cars?.map((car) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
