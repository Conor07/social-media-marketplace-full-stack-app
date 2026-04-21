import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { AppDispatch } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onBurgerClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onBurgerClick }) => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const user =
    useSelector((state: RootState) => state.auth.user) ||
    JSON.parse(localStorage.getItem("user") || "null");

  const handleSignOut = () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="md:hidden mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open sidebar"
          onClick={onBurgerClick}
        >
          <span className="block w-6 h-0.5 bg-gray-800 mb-1" />

          <span className="block w-6 h-0.5 bg-gray-800 mb-1" />

          <span className="block w-6 h-0.5 bg-gray-800" />
        </button>

        <h1 className="text-xl font-bold">Shop & Post</h1>
      </div>

      {user && (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">{user.username}</span>

          <button
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
