import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#e8e8ec]">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
