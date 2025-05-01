import React, { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import { useParticipants } from '../hooks/useParticipants';
import { Match, UpdateMatchInput } from '../api/types';

interface UpdateMatchFormProps {
  match: Match;
  onSuccess: () => void;
}

const UpdateMatchForm: React.FC<UpdateMatchFormProps> = ({
  match,
  onSuccess,
}) => {
  const { updateMatch } = useMatches();
  const { participants, loading: loadingParticipants } = useParticipants();
  const [formData, setFormData] = useState<UpdateMatchInput>({
    id: match.id,
    participant1Id: match.participant1Id || '',
    participant2Id: match.participant2Id || '',
    winnerId: match.winnerId || '',
    score1: match.score1 || 0,
    score2: match.score2 || 0,
    songPerformed: match.songPerformed || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'score1' || name === 'score2' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateMatch(formData);
      if (result) {
        onSuccess();
      } else {
        setError('Failed to update match');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Match</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="participant1Id" className="block mb-2">
            Participant 1
          </label>
          <select
            id="participant1Id"
            name="participant1Id"
            value={formData.participant1Id}
            onChange={handleChange}
            className="select"
          >
            <option value="">Select participant</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="score1" className="block mb-2">
            Score 1
          </label>
          <input
            type="number"
            id="score1"
            name="score1"
            value={formData.score1}
            onChange={handleChange}
            min="0"
            className="input"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="participant2Id" className="block mb-2">
            Participant 2
          </label>
          <select
            id="participant2Id"
            name="participant2Id"
            value={formData.participant2Id}
            onChange={handleChange}
            className="select"
          >
            <option value="">Select participant</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="score2" className="block mb-2">
            Score 2
          </label>
          <input
            type="number"
            id="score2"
            name="score2"
            value={formData.score2}
            onChange={handleChange}
            min="0"
            className="input"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="winnerId" className="block mb-2">
            Winner
          </label>
          <select
            id="winnerId"
            name="winnerId"
            value={formData.winnerId}
            onChange={handleChange}
            className="select"
          >
            <option value="">Select winner</option>
            {formData.participant1Id && (
              <option value={formData.participant1Id}>
                {participants.find((p) => p.id === formData.participant1Id)
                  ?.name || 'Participant 1'}
              </option>
            )}
            {formData.participant2Id && (
              <option value={formData.participant2Id}>
                {participants.find((p) => p.id === formData.participant2Id)
                  ?.name || 'Participant 2'}
              </option>
            )}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="songPerformed" className="block mb-2">
            Song
          </label>
          <input
            type="text"
            id="songPerformed"
            name="songPerformed"
            value={formData.songPerformed}
            onChange={handleChange}
            className="input"
            placeholder="Song title"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || loadingParticipants}
            className={`btn btn-primary ${isSubmitting || loadingParticipants ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Match'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMatchForm;
