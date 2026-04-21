import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { login, register } from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  mode?: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ mode = "login" }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [isRegister, setIsRegister] = useState(mode === "register");

  const { status, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === "succeeded" && user?.userId) {
      const timer = setTimeout(() => {
        navigate("/posts");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [status, user, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRegister) {
      dispatch(register({ username, password }));
    } else {
      dispatch(login({ username, password }));
    }
  };

  return (
    <div className="auth-form">
      <h2>{isRegister ? "Register" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={status === "loading"}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <button onClick={() => setIsRegister((v) => !v)}>
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default AuthForm;
