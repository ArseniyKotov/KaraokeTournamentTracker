import React, { useState } from 'react';
import { useTournaments } from '../hooks/useTournaments';
import { CreateTournamentInput } from '../api/types';

interface CreateTournamentFormProps {
  onSuccess: () => void;
}

const CreateTournamentForm: React.FC<CreateTournamentFormProps> = ({ onSuccess }) => {
  const { createTournament } = useTournaments();
  const [formData, setFormData] = useState<CreateTournamentInput>({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'UPCOMING'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert date string to ISO format
      const dateWithTime = new Date(formData.date);
      const tournamentInput = {
        ...formData,
        date: dateWithTime.toISOString()
      };

      const result = await createTournament(tournamentInput);
      if (result) {
        setFormData({
          name: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          status: 'UPCOMING'
        });
        onSuccess();
      } else {
        setError('Failed to create tournament');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Tournament</h2>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Tournament Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
            placeholder="Summer Karaoke Showdown"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
            rows={3}
            placeholder="Details about your tournament..."
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="date" className="block mb-2">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="status" className="block mb-2">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select"
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Creating...' : 'Create Tournament'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTournamentForm;
