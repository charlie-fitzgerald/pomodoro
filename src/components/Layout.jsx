// /src/components/Layout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Top navbar */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-6 h-16 items-center">
            <li>
              <Link
                to="/"
                className="hover:text-gray-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="hover:text-gray-300"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-gray-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className="hover:text-gray-300"
              >
                History
              </Link>
            </li>
            {/* <li>
              <Link
                to="/billing"
                className="hover:text-gray-300"
              >
                Billing
              </Link>
            </li> */}
            <li>
              <Link
                to="/team"
                className="hover:text-gray-300"
              >
                Team
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
