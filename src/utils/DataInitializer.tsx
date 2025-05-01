import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { seedDatabase } from './mockData';

interface DataInitializerProps {
  children: React.ReactNode;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      // Check if we've already seeded the database in this session
      const hasSeeded = sessionStorage.getItem('dbSeeded');
      if (hasSeeded === 'true') {
        console.log('Database already seeded in this session');
        setIsInitialized(true);
        return;
      }

      try {
        const client = generateClient<Schema>();
        await seedDatabase(client);
        sessionStorage.setItem('dbSeeded', 'true');
        setIsInitialized(true);
      } catch (err) {
        console.error('Error seeding database:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Unknown error during data initialization')
        );
        setIsInitialized(true); // Continue anyway
      }
    };

    initializeData();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-accent mx-auto"></div>
          <p className="mt-4 text-lg">Initializing application data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Continuing despite initialization error:', error);
  }

  return <>{children}</>;
};

export default DataInitializer;
