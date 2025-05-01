import React from 'react';
import { useTournaments } from '../hooks/useTournaments';
import { format } from 'date-fns';

interface TournamentListProps {
  onSelectTournament: (tournamentId: string) => void;
}

const TournamentList: React.FC<TournamentListProps> = ({ onSelectTournament }) => {
  const { tournaments, loading, error } = useTournaments();

  if (loading) return <div className="text-center py-8">Loading tournaments...</div>;
  
  if (error) return (
    <div className="text-center py-8 text-red-500">
      Error loading tournaments: {error.message}
    </div>
  );

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">No tournaments found</p>
        <p className="text-primary-text opacity-70">Create a new tournament to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map(tournament => (
        <div key={tournament.id} className="card hover:shadow-xl transition-all">
          <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
          {tournament.description && (
            <p className="text-primary-text opacity-70 mb-4">{tournament.description}</p>
          )}
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{format(new Date(tournament.date), 'PPP')}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              tournament.status === 'UPCOMING' ? 'bg-blue-900 text-blue-200' :
              tournament.status === 'IN_PROGRESS' ? 'bg-yellow-900 text-yellow-200' :
              'bg-green-900 text-green-200'
            }`}>
              {tournament.status || 'UPCOMING'}
            </span>
          </div>
          <button 
            onClick={() => onSelectTournament(tournament.id)} 
            className="btn btn-primary w-full"
          >
            View Tournament
          </button>
        </div>
      ))}
    </div>
  );
};

export default TournamentList;
