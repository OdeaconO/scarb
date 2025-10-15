import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BuyPage() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [seller, setSeller] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function fetchCar() {
      const res = await axios.get(`/api/cars/${{ carId }}`);
      setCar(res.data);

      const userRes = await axios.get(`/api/users/${res.data.user_id}`);
      setSeller(userRes.data);
    }
    fetchCar();
  }, [carId]);

  if (!car || !seller) return <div>Loading...</div>;

  return (
    <div className="nes-container is-dark">
      <img src={`/${car.image}`} alt="" style={{ width: "400px" }} />
      <h2>
        {car.brand} {car.model} ({car.year})
      </h2>
      <ul>
        <li>Seating: {car.seating}</li>
        <li>Transmission: {car.transmission}</li>
        <li>Body Style: {car.body_style}</li>
        <li>Mileage: {car.mileage}</li>
      </ul>
      <button
        className="nes-btn is-warning"
        onClick={() => setShowContact(true)}
      >
        Contact Seller
      </button>
      {showContact && (
        <div style={{ marginTop: "1rem" }}>
          <p>Email: {seller.email}</p>
          {car.contact_pref === true && <p>Phone: {seller.phone}</p>}
        </div>
      )}
    </div>
  );
}
