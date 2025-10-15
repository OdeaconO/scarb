import axios from "axios";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const [section, setSection] = useState("info");
  const [info, setInfo] = useState(null);
  const [listings, setListings] = useState([]);

  const userId = 1;

  useEffect(() => {
    if (section === "info") {
      axios.get(`/api/users/${userId}`).then((res) => setInfo(res.data));
    }
    if (section === "listings") {
      axios
        .get(`/api/users/${userId}/listings`)
        .then((res) => setListings(res.data));
    }
  }, [section, userId]);

  function handleLogout() {
    if (window.confirm("Really Log Out?")) {
      window.location = "/login";
    }
  }

  return (
    <div className="nes-container is-dark">
      <button onClick={() => setSection("info")} className="nes-btn is-primary">
        Account Info
      </button>
      <button
        onClick={() => setSection("listings")}
        className="nes-btn"
        style={{ margin: "0 10px" }}
      >
        Your Listings
      </button>
      <button onClick={handleLogout} className="nes-btn is-error">
        Log Out
      </button>
      <br />
      <br />
      {section === "info" && info && (
        <div>
          <p>Name: {info.name}</p>
          <p>Phone: {info.phone}</p>
          <p>Address: {info.address}</p>
          <p>Email: {info.email}</p>
          <p>ID Proof: {info.id_number}</p>
        </div>
      )}
      {section === "listings" && (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {listings.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
