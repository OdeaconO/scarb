import axios from "axios";
import { useState } from "react";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    idNumber: "",
    idProof: null,
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => setForm({ ...form, ifProof: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    await axios.post("/api/auth/signup", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="nes-container is-dark">
      {/* INPUTS */}
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
      <button className="nes-btn is-primary" type="submit">
        Create Account
      </button>
      <p>Please enter the email and phone you want buyers to contact.</p>
    </form>
  );
}
