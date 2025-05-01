import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import { Tournament, CreateTournamentInput } from "../api/types";

const client = generateClient<Schema>();

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const { data, errors } = await client.models.Tournament.list();
      if (errors) throw new Error(errors[0].message);
      setTournaments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const createTournament = async (input: CreateTournamentInput) => {
    try {
      const { data, errors } = await client.models.Tournament.create(input);
      if (errors) throw new Error(errors[0].message);
      setTournaments([...tournaments, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return { tournaments, loading, error, createTournament, refreshTournaments: fetchTournaments };
}
