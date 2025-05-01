/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Round, CreateRoundInput } from '../api/types';

const client = generateClient<Schema>();

//@ts-expect-error no
export function useRounds(tournamentId?: string) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoundsByTournament = async (tournamentId: string) => {
    setLoading(true);
    try {
      const { data, errors } = await client.models.Round.list({
        filter: { tournamentId: { eq: tournamentId } },
        //@ts-expect-error no
        sort: { field: 'order', direction: 'ASC' },
      });
      if (errors) throw new Error(errors[0].message);
      //@ts-expect-error no
      setRounds(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createRound = async (input: CreateRoundInput) => {
    try {
      const { data, errors } = await client.models.Round.create(input);
      if (errors) throw new Error(errors[0].message);
      //@ts-expect-error no
      setRounds([...rounds, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    }
  };

  return { rounds, loading, error, createRound, fetchRoundsByTournament };
}
