import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Mental Health IQ. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
            <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
            <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 