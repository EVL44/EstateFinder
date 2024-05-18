import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./register.scss";
import { useState } from "react";

function Register() {

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target)

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password
      });
      navigate("/login");

    } catch (error) {
      console.error("Error:", error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={ handleSubmit }>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" required/>
          <input name="email" type="email" placeholder="Email" required/>
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit" disabled={isLoading}>Register</button>
          {error && <span className="error">{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
