import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Posts from "./pages/Posts";
import ItemsToSell from "./pages/ItemsToSell";
import Store from "./pages/Store";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

const App: React.FC = () => {
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
              <Route path="/" element={<Navigate to="/posts" replace />} />

              <Route path="/posts" element={<Posts />} />

              <Route path="/items-to-sell" element={<ItemsToSell />} />

              <Route path="/store" element={<Store />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
