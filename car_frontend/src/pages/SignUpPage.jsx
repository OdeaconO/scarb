// SignUpPage.jsx (replace existing)
import axios from "axios";
import { useState } from "react";
import { uploadFileAndGetUrl } from "../lib/blobUpload";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    idNumber: "",
    password: "",
  });
  const [idProofFile, setIdProofFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = (e) => setIdProofFile(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let idProofUrl = null;
      if (idProofFile) {
        idProofUrl = await uploadFileAndGetUrl(idProofFile);
      }

      const body = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        email: form.email,
        idNumber: form.idNumber,
        password: form.password,
        idProofUrl, // <-- URL returned by Vercel Blob
      };

      await axios.post("/api/auth/signup", body, {
        headers: { "Content-Type": "application/json" },
      });

      setLoading(false);
      // optionally, navigate to login or auto-login
      window.location = "/login";
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="nes-container is-dark">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        type="text"
        placeholder="Name"
        required
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        type="number"
        placeholder="Phone"
        required
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        type="text"
        placeholder="Address"
        required
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
        placeholder="Email"
        required
      />
      <input
        name="idNumber"
        value={form.idNumber}
        onChange={handleChange}
        type="text"
        placeholder="ID Number"
        required
      />
      <input name="idProof" type="file" onChange={handleFile} required />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        type="password"
        placeholder="Password"
        required
      />
      <button className="nes-btn is-primary" type="submit" disabled={loading}>
        {loading ? "Signing up…" : "Create Account"}
      </button>
    </form>
  );
}
