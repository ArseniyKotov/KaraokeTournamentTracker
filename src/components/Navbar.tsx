import React from 'react';

interface NavbarProps {
  username?: string;
  onSignOut?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onSignOut }) => {
  return (
    <nav className="bg-primary-container shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="text-xl font-bold text-primary-text">VocalBracket</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {username && (
              <span className="text-primary-text">Welcome, {username}</span>
            )}
            {onSignOut && (
              <button 
                onClick={onSignOut} 
                className="btn btn-secondary text-sm"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
