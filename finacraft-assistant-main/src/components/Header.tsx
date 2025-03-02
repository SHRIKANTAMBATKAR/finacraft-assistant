
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M2 17h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z"></path>
              <path d="M22 9h-4v6h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"></path>
              <circle cx="7" cy="12" r="1.5"></circle>
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Smart Budget</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#dashboard" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </a>
          <a 
            href="#transactions" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Transactions
          </a>
          <a 
            href="#insights" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Insights
          </a>
          <a 
            href="#recommendations" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Recommendations
          </a>
        </nav>

        {/* Login Button */}
        <Button
          variant="outline"
          className="hidden md:flex"
          size="sm"
        >
          Sign In
        </Button>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass animate-fade-in p-4">
          <nav className="flex flex-col space-y-4 pb-4">
            <a 
              href="#dashboard" 
              className="text-sm font-medium transition-colors hover:text-primary p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </a>
            <a 
              href="#transactions" 
              className="text-sm font-medium transition-colors hover:text-primary p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Transactions
            </a>
            <a 
              href="#insights" 
              className="text-sm font-medium transition-colors hover:text-primary p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Insights
            </a>
            <a 
              href="#recommendations" 
              className="text-sm font-medium transition-colors hover:text-primary p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Recommendations
            </a>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
            >
              Sign In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
