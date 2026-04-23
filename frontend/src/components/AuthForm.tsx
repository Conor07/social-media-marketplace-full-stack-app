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
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h2 className="text-2xl">{isRegister ? "Register" : "Login"}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={status === "loading"}
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <button
        onClick={() => {
          setIsRegister((v) => !v);
          setUsername("");
          setPassword("");
        }}
        className="m-4 p-2 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default AuthForm;
