import axios from "axios";
import { useState } from "react";

export default function ListingForm({ onListingAdded }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    seating: "",
    transmission: "",
    bodyStyle: "",
    mileage: "",
    contactPref: "true", // keep as string to avoid controlled-type mismatch
    carImage: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFile(e) {
    setForm((prev) => ({ ...prev, carImage: e.target.files[0] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();

    // Append keys explicitly to have control over types (and ensure file works)
    data.append("brand", form.brand);
    data.append("model", form.model);
    data.append("year", form.year);
    data.append("seating", form.seating);
    data.append("transmission", form.transmission);
    data.append("bodyStyle", form.bodyStyle);
    data.append("mileage", form.mileage);
    // send contactPref as "true"/"false" string (backend can cast if needed)
    data.append("contactPref", form.contactPref);
    if (form.carImage) data.append("carImage", form.carImage);

    // static user for now (same as before)
    data.append("userId", 1);

    await axios.post("/api/cars/sell", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    onListingAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="nes-container is-dark">
      <input
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        required
        className="nes-input"
      />
      <input
        name="model"
        placeholder="Model"
        value={form.model}
        onChange={handleChange}
        required
        className="nes-input"
      />
      <input
        name="year"
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
        required
        className="nes-input"
      />

      {/* Seating select with non-selectable placeholder */}
      <select
        name="seating"
        value={form.seating}
        onChange={handleChange}
        className="nes-select"
        style={{ width: "100%" }}
      >
        <option value="" disabled hidden>
          Seating
        </option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
      </select>

      {/* Transmission select */}
      <select
        name="transmission"
        value={form.transmission}
        onChange={handleChange}
        className="nes-select"
        style={{ width: "100%" }}
      >
        <option value="" disabled hidden>
          Transmission
        </option>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual</option>
      </select>

      {/* Body style select */}
      <select
        name="bodyStyle"
        value={form.bodyStyle}
        onChange={handleChange}
        className="nes-select"
        style={{ width: "100%" }}
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

      <input
        name="mileage"
        placeholder="Mileage"
        value={form.mileage}
        onChange={handleChange}
        className="nes-input"
      />

      <input
        name="carImage"
        type="file"
        onChange={handleFile}
        required
        className="nes-input"
      />

      <label style={{ display: "block", marginTop: "0.4rem" }}>
        Would you like to display your phone number along with your email to
        potential buyers?
        <select
          name="contactPref"
          value={form.contactPref}
          onChange={handleChange}
          className="nes-select"
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>

      <button className="nes-btn is-primary" style={{ marginTop: "0.6rem" }}>
        Upload Listing
      </button>
    </form>
  );
}
