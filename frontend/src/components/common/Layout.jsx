import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import CustomCursor from "./CustomCursor";
import BackToTop from "./BackToTop";
import AnnouncementBar from "./AnnouncementBar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-deep">
      <ScrollProgress />
      <CustomCursor />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pt-16">{children || <Outlet />}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}

