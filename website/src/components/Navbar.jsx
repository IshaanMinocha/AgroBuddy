import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="AgroBuddy Logo" className="h-10 w-10" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-emerald-800 hover:text-emerald-600 transition-colors text-sm">About</a>
            <a href="#about" className="text-emerald-800 hover:text-emerald-600 transition-colors text-sm">Features</a>
            <a href="#contact" className="text-emerald-800 hover:text-emerald-600 transition-colors text-sm">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-emerald-50">
            <div className="flex flex-col p-4 gap-4">
              <a 
                href="#features" 
                className="text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#about" 
                className="text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;