// ListingForm.jsx (replace existing)
import axios from "axios";
import { useState } from "react";
import { uploadFileAndGetUrl } from "../lib/blobUpload";

export default function ListingForm({ onListingAdded }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    seating: "",
    transmission: "",
    bodyStyle: "",
    mileage: "",
    contactPref: "true",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleFile(e) {
    setFile(e.target.files[0] || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadFileAndGetUrl(file);
      }

      const payload = {
        brand: form.brand,
        model: form.model,
        year: form.year,
        seating: form.seating,
        transmission: form.transmission,
        bodyStyle: form.bodyStyle,
        mileage: form.mileage,
        contactPref: form.contactPref,
        imageUrl, // <--- URL returned by Vercel Blob
      };

      const token = localStorage.getItem("token");
      await axios.post("/api/cars/sell", payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      onListingAdded && onListingAdded();
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Upload/listing failed");
    }
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
        Display phone to buyers?
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

      <button
        className="nes-btn is-primary"
        style={{ marginTop: "0.6rem" }}
        disabled={loading}
      >
        {loading ? "Uploading…" : "Upload Listing"}
      </button>
    </form>
  );
}
