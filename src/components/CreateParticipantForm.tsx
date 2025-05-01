import React, { useState } from 'react';
import { useParticipants } from '../hooks/useParticipants';
import { CreateParticipantInput } from '../api/types';

interface CreateParticipantFormProps {
  onSuccess: () => void;
}

const CreateParticipantForm: React.FC<CreateParticipantFormProps> = ({ onSuccess }) => {
  const { createParticipant } = useParticipants();
  const [formData, setFormData] = useState<CreateParticipantInput>({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createParticipant(formData);
      if (result) {
        setFormData({
          name: '',
          email: ''
        });
        onSuccess();
      } else {
        setError('Failed to create participant');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Participant</h2>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
            placeholder="Participant name"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2">Email (Optional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="email@example.com"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Participant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateParticipantForm;
