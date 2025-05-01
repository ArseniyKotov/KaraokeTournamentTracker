import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { useRounds } from '../hooks/useRounds';
import { useMatches } from '../hooks/useMatches';
import { Tournament, Round, Match, Participant } from '../api/types';

interface TournamentBracketProps {
  tournamentId: string;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ tournamentId }) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { rounds, loading: loadingRounds, fetchRoundsByTournament } = useRounds();
  const { matches, loading: loadingMatches, updateMatch, fetchMatchesByRound } = useMatches();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const client = generateClient<Schema>();

  // Fetch tournament details
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const { data, errors } = await client.models.Tournament.get({ id: tournamentId });
        if (errors) throw new Error(errors[0].message);
        if (!data) throw new Error('Tournament not found');
        setTournament(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchTournament();
  }, [tournamentId]);

  // Fetch rounds for this tournament
  useEffect(() => {
    if (tournamentId) {
      fetchRoundsByTournament(tournamentId);
    }
  }, [tournamentId]);

  // Fetch all participants
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data, errors } = await client.models.Participant.list();
        if (errors) throw new Error(errors[0].message);
        setParticipants(data);
      } catch (err) {
        console.error('Error fetching participants:', err);
      }
    };

    fetchParticipants();
  }, []);

  // Fetch matches for all rounds
  useEffect(() => {
    const fetchAllMatches = async () => {
      setLoading(true);
      try {
        if (rounds.length > 0) {
          for (const round of rounds) {
            await fetchMatchesByRound(round.id);
          }
        }
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    if (rounds.length > 0) {
      fetchAllMatches();
    }
  }, [rounds]);

  const handleUpdateMatch = async (matchId: string, updates: any) => {
    await updateMatch({
      id: matchId,
      ...updates
    });
  };

  if (loading || loadingRounds || loadingMatches) {
    return <div className="text-center py-8">Loading tournament bracket...</div>;
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
    <div className="tournament-bracket">
      <h2 className="text-2xl font-bold mb-6">{tournament.name} - Bracket</h2>
      
      {rounds.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">No rounds have been created for this tournament yet.</p>
          <p className="text-primary-text opacity-70">Create rounds to start building your bracket!</p>
        </div>
      ) : (
        <div className="bracket-container overflow-x-auto">
          <div className="flex space-x-8 pb-6">
            {rounds.map(round => (
              <div key={round.id} className="round min-w-[300px]">
                <h3 className="text-xl font-semibold mb-4 text-center bg-primary-container p-2 rounded-t-lg border-b border-slate-700">
                  {round.name}
                </h3>
                <div className="space-y-6">
                  {matches
                    .filter(match => match.roundId === round.id)
                    .map(match => (
                      <div key={match.id} className="match bg-slate-800 p-4 rounded-lg shadow">
                        <div className={`participant p-3 rounded mb-2 flex justify-between items-center ${match.winnerId === match.participant1Id ? 'bg-green-900/30 border border-green-700' : 'bg-slate-700'}`}>
                          <span>{participants.find(p => p.id === match.participant1Id)?.name || 'TBD'}</span>
                          {match.score1 !== undefined && <span className="font-bold">{match.score1}</span>}
                        </div>
                        
                        <div className="text-center text-xs text-primary-text opacity-70 my-1">vs</div>
                        
                        <div className={`participant p-3 rounded mb-2 flex justify-between items-center ${match.winnerId === match.participant2Id ? 'bg-green-900/30 border border-green-700' : 'bg-slate-700'}`}>
                          <span>{participants.find(p => p.id === match.participant2Id)?.name || 'TBD'}</span>
                          {match.score2 !== undefined && <span className="font-bold">{match.score2}</span>}
                        </div>
                        
                        {match.songPerformed && (
                          <div className="song mt-2 text-sm text-primary-accent">
                            <span className="font-semibold">Song:</span> {match.songPerformed}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;
