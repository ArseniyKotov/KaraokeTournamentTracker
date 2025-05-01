import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import TournamentBracket from '../components/TournamentBracket';
import CreateRoundForm from '../components/CreateRoundForm';
import CreateMatchForm from '../components/CreateMatchForm';
import ParticipantList from '../components/ParticipantList';
import CreateParticipantForm from '../components/CreateParticipantForm';
import { useRounds } from '../hooks/useRounds';

interface TournamentDetailProps {
  tournamentId: string;
  onBack: () => void;
}

const TournamentDetail: React.FC<TournamentDetailProps> = ({ tournamentId, onBack }) => {
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<'bracket' | 'rounds' | 'participants'>('bracket');
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const { rounds, fetchRoundsByTournament } = useRounds();

  const client = generateClient<Schema>();

  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      try {
        const { data, errors } = await client.models.Tournament.get({ id: tournamentId });
        if (errors) throw new Error(errors[0].message);
        if (!data) throw new Error('Tournament not found');
        setTournament(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  useEffect(() => {
    if (tournamentId) {
      fetchRoundsByTournament(tournamentId);
    }
  }, [tournamentId]);

  const handleRoundCreated = () => {
    fetchRoundsByTournament(tournamentId);
  };

  const handleMatchCreated = () => {
    // Reset selected round to refresh matches
    setSelectedRoundId(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading tournament details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!tournament) {
    return <div className="text-center py-8">Tournament not found</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <button 
          onClick={onBack} 
          className="flex items-center text-primary-accent hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Tournaments
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
        {tournament.description && (
          <p className="text-primary-text opacity-70 mb-4">{tournament.description}</p>
        )}
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            tournament.status === 'UPCOMING' ? 'bg-blue-900/50 text-blue-200' :
            tournament.status === 'IN_PROGRESS' ? 'bg-yellow-900/50 text-yellow-200' :
            'bg-green-900/50 text-green-200'
          }`}>
            {tournament.status}
          </span>
          <span className="text-primary-text opacity-70">
            {new Date(tournament.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('bracket')}
              className={`py-4 px-1 font-medium border-b-2 ${
                activeTab === 'bracket' 
                  ? 'border-primary-accent text-primary-accent' 
                  : 'border-transparent text-primary-text opacity-70 hover:text-primary-text hover:opacity-100'
              }`}
            >
              Tournament Bracket
            </button>
            <button
              onClick={() => setActiveTab('rounds')}
              className={`py-4 px-1 font-medium border-b-2 ${
                activeTab === 'rounds' 
                  ? 'border-primary-accent text-primary-accent' 
                  : 'border-transparent text-primary-text opacity-70 hover:text-primary-text hover:opacity-100'
              }`}
            >
              Manage Rounds
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`py-4 px-1 font-medium border-b-2 ${
                activeTab === 'participants' 
                  ? 'border-primary-accent text-primary-accent' 
                  : 'border-transparent text-primary-text opacity-70 hover:text-primary-text hover:opacity-100'
              }`}
            >
              Participants
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'bracket' && (
        <TournamentBracket tournamentId={tournamentId} />
      )}

      {activeTab === 'rounds' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Tournament Rounds</h2>
            
            {rounds.length === 0 ? (
              <div className="card">
                <p className="text-center py-4">No rounds created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rounds.map(round => (
                  <div key={round.id} className="card">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">{round.name}</h3>
                      <span className="bg-slate-700 px-2 py-1 rounded text-xs">Order: {round.order}</span>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <button 
                        onClick={() => setSelectedRoundId(round.id)}
                        className="btn btn-secondary text-sm"
                      >
                        Add Match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8">
              <CreateRoundForm 
                tournamentId={tournamentId} 
                onSuccess={handleRoundCreated} 
              />
            </div>
          </div>
          
          <div>
            {selectedRoundId && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Add Match to {rounds.find(r => r.id === selectedRoundId)?.name}
                </h2>
                <CreateMatchForm 
                  roundId={selectedRoundId} 
                  onSuccess={handleMatchCreated} 
                />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Participants</h2>
            <ParticipantList />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Add Participant</h2>
            <CreateParticipantForm onSuccess={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentDetail;
