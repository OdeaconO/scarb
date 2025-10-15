import axios from "axios";
import { useState } from "react";

export default function LoginPage() {
  const [login, setLogin] = useState;
  ({ identity: "", password: "" });

  const handleChange = (e) =>
    setLogin({ ...login, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", login);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location = "/account";
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="nes-container is-dark">
      <input
        name="identity"
        value={login.identity}
        onChange={handleChange}
        type="text"
        placeholder="Email or Phone"
        required
      />
      <input
        name="password"
        value={login.password}
        onChange={handleChange}
        type="password"
        placeholder="Password"
        required
      />
      <a href="/forgot-password">Forgot password?</a>
      <button className="nes-btn is-primary" type="submit">
        Login
      </button>
    </form>
  );
}
