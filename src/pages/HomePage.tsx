import React, { useState } from 'react';
import TournamentList from '../components/TournamentList';
import CreateTournamentForm from '../components/CreateTournamentForm';
import TournamentDetail from './TournamentDetail';

const HomePage: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const handleSelectTournament = (tournamentId: string) => {
    setSelectedTournamentId(tournamentId);
    setView('detail');
  };

  const handleBackToList = () => {
    setSelectedTournamentId(null);
    setView('list');
  };

  return (
    <div>
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Karaoke Tournaments</h1>
            <button 
              onClick={() => setView('create')} 
              className="btn btn-primary"
            >
              Create Tournament
            </button>
          </div>
          <TournamentList onSelectTournament={handleSelectTournament} />
        </>
      )}

      {view === 'create' && (
        <>
          <div className="mb-8">
            <button 
              onClick={() => setView('list')} 
              className="flex items-center text-primary-accent hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Tournaments
            </button>
          </div>
          <CreateTournamentForm onSuccess={() => setView('list')} />
        </>
      )}

      {view === 'detail' && selectedTournamentId && (
        <TournamentDetail 
          tournamentId={selectedTournamentId} 
          onBack={handleBackToList} 
        />
      )}
    </div>
  );
};

export default HomePage;
