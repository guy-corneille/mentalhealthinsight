import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Mental Health Insight"
              />
            </div>
            <nav className="hidden md:flex space-x-8 ml-10">
              <a
                href="/dashboard"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Dashboard
              </a>
              <a
                href="/facilities"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Facilities
              </a>
              <a
                href="/patients"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Patients
              </a>
              <a
                href="/staff"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Staff
              </a>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>New Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 