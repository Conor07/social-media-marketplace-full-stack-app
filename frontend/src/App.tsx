import { useState } from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Posts from "./pages/Posts";
import ItemsToSell from "./pages/ItemsToSell";
import Store from "./pages/Store";
import AuthForm from "./components/AuthForm";
import { checkAuth } from "./features/auth/authSlice";
import { useAppDispatch } from "./app/hooks";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header onBurgerClick={handleSidebarOpen} />

        <div className="flex flex-1">
          <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

          <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
            <Routes>
              <Route path="/login" element={<AuthForm />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/posts" replace />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/posts"
                element={
                  <ProtectedRoute>
                    <Posts />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/items-to-sell"
                element={
                  <ProtectedRoute>
                    <ItemsToSell />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/store"
                element={
                  <ProtectedRoute>
                    <Store />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
