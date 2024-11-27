import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

interface AuthProps {
  onLogin: (user: { username: string; funds: number }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URLS = {
    register: "http://localhost:4000/api/auth/register",
    login: "http://localhost:4000/api/auth/login",
  };

  const validateForm = () => {
    const { username, password } = formData;
    if (!username || !password) {
      alert("Username and Password are required");
      return false;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const url = isRegister ? API_URLS.register : API_URLS.login;

    try {
      setLoading(true);
      const response = await axios.post(url, formData);

      if (!isRegister) {
        const { user } = response.data;
        onLogin(user);
      }
      alert(isRegister ? "Registration successful" : "Login successful");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "An unexpected error occurred.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} disabled={loading}>
        {isRegister ? "Switch to Login" : "Switch to Register"}
      </button>
    </div>
  );
};

export default Auth;
