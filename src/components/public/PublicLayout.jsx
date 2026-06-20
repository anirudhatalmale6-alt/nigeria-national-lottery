import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Spacer to offset fixed navbar height */}
      <div className="h-18 lg:h-20" />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
