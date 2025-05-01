import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import { Match, CreateMatchInput, UpdateMatchInput } from "../api/types";

const client = generateClient<Schema>();

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMatchesByRound = async (roundId: string) => {
    setLoading(true);
    try {
      const { data, errors } = await client.models.Match.list({
        filter: { roundId: { eq: roundId } }
      });
      if (errors) throw new Error(errors[0].message);
      setMatches(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createMatch = async (input: CreateMatchInput) => {
    try {
      const { data, errors } = await client.models.Match.create(input);
      if (errors) throw new Error(errors[0].message);
      setMatches([...matches, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  const updateMatch = async (input: UpdateMatchInput) => {
    try {
      const { data, errors } = await client.models.Match.update(input);
      if (errors) throw new Error(errors[0].message);
      setMatches(matches.map(match => match.id === data.id ? data : match));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  return { 
    matches, 
    loading, 
    error, 
    createMatch, 
    updateMatch, 
    fetchMatchesByRound 
  };
}
