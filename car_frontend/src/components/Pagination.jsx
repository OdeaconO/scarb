export default function Pagination({ page, pageCount, onPageChange }) {
  return (
    <div style={{ margin: "1rem" }}>
      {Array.from({ length: pageCount }, (_, idx) => (
        <button
          key={idx + 1}
          onClick={() => onPageChange(idx + 1)}
          style={{
            margin: "0 3px",
            fontWeight: idx + 1 === page ? "bold" : undefined,
          }}
          className={`nes-btn ${idx + 1 === page ? "is-primary" : ""}`}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
}
