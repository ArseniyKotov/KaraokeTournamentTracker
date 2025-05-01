/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Participant, CreateParticipantInput } from '../api/types';

const client = generateClient<Schema>();

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const { data, errors } = await client.models.Participant.list();
      if (errors) throw new Error(errors[0].message);
      //@ts-expect-error no
      setParticipants(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const createParticipant = async (input: CreateParticipantInput) => {
    try {
      const { data, errors } = await client.models.Participant.create(input);
      if (errors) throw new Error(errors[0].message);
      //@ts-expect-error no
      setParticipants([...participants, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return {
    participants,
    loading,
    error,
    createParticipant,
    refreshParticipants: fetchParticipants,
  };
}
