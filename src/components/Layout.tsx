import React, { ReactNode } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen flex flex-col">
          <Navbar username={user?.username} onSignOut={signOut} />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-primary-container py-6">
            <div className="container mx-auto px-4 text-center">
              <p className="text-primary-text opacity-70">
                VocalBracket - Karaoke Tournament Tracker ©{' '}
                {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      )}
    </Authenticator>
  );
};

export default Layout;
