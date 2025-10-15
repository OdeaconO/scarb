export default function CarCard({ car }) {
  return (
    <div
      className="nes-container is-dark"
      style={{ width: 230, margin: "0.5rem" }}
    >
      <Link to={`/buy/${car.id}`}>
        <img
          src={`/${car.image}`}
          alt={`${car.brand} ${car.model}`}
          style={{ width: "200px", height: "150px", objectFit: "cover" }}
        />
        <p>
          {car.brand}
          {car.model}
        </p>
        <p>{car.year}</p>
      </Link>
    </div>
  );
}
