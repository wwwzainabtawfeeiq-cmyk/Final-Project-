import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import CustomCursor from './CustomCursor';
import BackToTop from './BackToTop';
import AnnouncementBar from './AnnouncementBar';
import NotificationBar from './NotificationBar';
import TourButton from '../tour/TourButton';

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-deep">
      <ScrollProgress />
      <CustomCursor />
      <AnnouncementBar />
      <Navbar />
      <NotificationBar />
      <main className="flex-1 pt-20">
        {children || <Outlet />}
      </main>
      <Footer />
      <BackToTop />
      <TourButton />
    </div>
  );
}