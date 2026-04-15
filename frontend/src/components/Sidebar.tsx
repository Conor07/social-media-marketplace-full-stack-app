import React from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose }) => {
  return (
    <>
      <div className="w-64 bg-gray-100 p-4 hidden md:block h-full">
        <nav>
          <ul>
            <li>
              <Link
                to="/posts"
                className="block mb-2 text-gray-800 hover:text-blue-500"
              >
                Posts
              </Link>
            </li>

            <li>
              <Link
                to="/items-to-sell"
                className="block mb-2 text-gray-800 hover:text-blue-500"
              >
                Items to Sell
              </Link>
            </li>

            <li>
              <Link
                to="/store"
                className="block mb-2 text-gray-800 hover:text-blue-500"
              >
                Store
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onClose}
            aria-label="Close sidebar overlay"
          />

          <div className="relative w-64 bg-gray-100 p-4 h-full z-50 shadow-lg animate-slide-in-left">
            <button
              className="absolute top-2 right-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close sidebar"
              onClick={onClose}
            >
              <IoClose className="w-6 h-6 text-gray-800" />
            </button>

            <nav>
              <ul>
                <li>
                  <Link
                    to="/posts"
                    className="block mb-2 text-gray-800 hover:text-blue-500"
                    onClick={onClose}
                  >
                    Posts
                  </Link>
                </li>

                <li>
                  <Link
                    to="/items-to-sell"
                    className="block mb-2 text-gray-800 hover:text-blue-500"
                    onClick={onClose}
                  >
                    Items to Sell
                  </Link>
                </li>

                <li>
                  <Link
                    to="/store"
                    className="block mb-2 text-gray-800 hover:text-blue-500"
                    onClick={onClose}
                  >
                    Store
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
