```typescript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Assuming you have an auth hook
import { ErrorBoundary } from './ErrorBoundary'; // Assuming you have an error boundary component

interface HeaderProps {
  appName: string;
}

const Header: React.FC<HeaderProps> = ({ appName }) => {
  const { user, signIn, signOut, isLoading, error } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Close the menu when the user logs in or out, or when the screen size changes
    setIsMenuOpen(false);
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <ErrorBoundary>
      <header className="bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 shadow">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* App Name / Logo */}
          <Link to="/" className="text-xl font-semibold hover:text-primary dark:hover:text-primary transition-colors duration-200">
            {appName}
          </Link>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-foreground dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent rounded-md p-1" aria-label="Open Menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Navigation Links (Hidden on mobile by default) */}
          <nav className={`md:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <Link to="/" className="hover:text-primary dark:hover:text-primary transition-colors duration-200 block md:inline-block py-2">
              Home
            </Link>
            <Link to="/tasks" className="hover:text-primary dark:hover:text-primary transition-colors duration-200 block md:inline-block py-2">
              Tasks
            </Link>
            <Link to="/about" className="hover:text-primary dark:hover:text-primary transition-colors duration-200 block md:inline-block py-2">
              About
            </Link>

            {/* Authentication Controls */}
            {isLoading ? (
              <span className="text-sm">Loading...</span>
            ) : error ? (
              <span className="text-red-500 text-sm">Error: {error.message}</span>
            ) : user ? (
              <>
                <button onClick={signOut} className="bg-secondary text-foreground dark:text-gray-900 py-2 px-4 rounded-md hover:bg-accent dark:hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary block md:inline-block">
                  Sign Out
                </button>
                <span className="ml-2 text-sm">Welcome, {user.displayName || user.email}</span>
              </>
            ) : (
              <button onClick={signIn} className="bg-secondary text-foreground dark:text-gray-900 py-2 px-4 rounded-md hover:bg-accent dark:hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary block md:inline-block">
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>
    </ErrorBoundary>
  );
};

export default Header;
```