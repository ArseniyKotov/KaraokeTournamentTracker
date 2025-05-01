import React, { useState } from 'react';
import { useRounds } from '../hooks/useRounds';
import { CreateRoundInput } from '../api/types';

interface CreateRoundFormProps {
  tournamentId: string;
  onSuccess: () => void;
}

const CreateRoundForm: React.FC<CreateRoundFormProps> = ({
  tournamentId,
  onSuccess,
}) => {
  const { createRound } = useRounds();
  const [formData, setFormData] = useState<CreateRoundInput>({
    name: '',
    order: 1,
    tournamentId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createRound(formData);
      if (result) {
        setFormData({
          name: '',
          order: formData.order + 1,
          tournamentId,
        });
        onSuccess();
      } else {
        setError('Failed to create round');
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
      <h2 className="text-xl font-bold mb-4">Add New Round</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Round Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
            placeholder="Quarter Finals"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="order" className="block mb-2">
            Round Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            required
            min="1"
            className="input"
          />
          <p className="text-sm text-primary-text opacity-70 mt-1">
            Lower numbers appear first in the bracket
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Round'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoundForm;
