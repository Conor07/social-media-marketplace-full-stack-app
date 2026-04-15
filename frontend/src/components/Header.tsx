import React from "react";

type HeaderProps = {
  onBurgerClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onBurgerClick }) => {
  return (
    <header className="w-full bg-white shadow-md p-4 flex items-center justify-between">
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
    </header>
  );
};

export default Header;
