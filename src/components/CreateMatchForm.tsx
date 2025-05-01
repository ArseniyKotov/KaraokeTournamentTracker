import React, { useState, useEffect } from 'react';
import { useMatches } from '../hooks/useMatches';
import { useParticipants } from '../hooks/useParticipants';
import { CreateMatchInput } from '../api/types';

interface CreateMatchFormProps {
  roundId: string;
  onSuccess: () => void;
}

const CreateMatchForm: React.FC<CreateMatchFormProps> = ({ roundId, onSuccess }) => {
  const { createMatch } = useMatches();
  const { participants, loading: loadingParticipants } = useParticipants();
  const [formData, setFormData] = useState<CreateMatchInput>({
    roundId,
    participant1Id: '',
    participant2Id: '',
    songPerformed: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createMatch(formData);
      if (result) {
        setFormData({
          roundId,
          participant1Id: '',
          participant2Id: '',
          songPerformed: ''
        });
        onSuccess();
      } else {
        setError('Failed to create match');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Match</h2>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="participant1Id" className="block mb-2">Participant 1</label>
          <select
            id="participant1Id"
            name="participant1Id"
            value={formData.participant1Id}
            onChange={handleChange}
            className="select"
          >
            <option value="">Select participant</option>
            {participants.map(participant => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="participant2Id" className="block mb-2">Participant 2</label>
          <select
            id="participant2Id"
            name="participant2Id"
            value={formData.participant2Id}
            onChange={handleChange}
            className="select"
          >
            <option value="">Select participant</option>
            {participants.map(participant => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="songPerformed" className="block mb-2">Song (Optional)</label>
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
            className={`btn btn-primary ${(isSubmitting || loadingParticipants) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Match'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMatchForm;
