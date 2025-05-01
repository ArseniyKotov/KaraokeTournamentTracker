import React from 'react';
import { useParticipants } from '../hooks/useParticipants';

const ParticipantList: React.FC = () => {
  const { participants, loading, error } = useParticipants();

  if (loading)
    return <div className="text-center py-4">Loading participants...</div>;

  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading participants: {error.message}
      </div>
    );

  if (participants.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-primary-text opacity-70">No participants found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-primary-container rounded-lg overflow-hidden">
        <thead className="bg-slate-700">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id} className="border-t border-slate-700">
              <td className="py-3 px-4">{participant.name}</td>
              <td className="py-3 px-4">{participant.email || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantList;
