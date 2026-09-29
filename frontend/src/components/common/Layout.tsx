import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import CustomCursor from './CustomCursor';
import BackToTop from './BackToTop';
import AnnouncementBar from './AnnouncementBar';
import TourButton from '../tour/TourButton';

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-deep">
      <ScrollProgress />
      <CustomCursor />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pt-16">
        {children || <Outlet />}
      </main>
      <Footer />
      <BackToTop />
      <TourButton />
    </div>
  );
}