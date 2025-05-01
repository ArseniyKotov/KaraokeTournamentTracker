export interface Tournament {
  id: string;
  name: string;
  description?: string;
  date: string;
  status?: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
  rounds?: Round[];
}

export interface Round {
  id: string;
  name: string;
  order: number;
  tournamentId: string;
  tournament?: Tournament;
  matches?: Match[];
}

export interface Match {
  id: string;
  roundId: string;
  round?: Round;
  participant1Id?: string;
  participant1?: Participant;
  participant2Id?: string;
  participant2?: Participant;
  winnerId?: string;
  winner?: Participant;
  score1?: number;
  score2?: number;
  songPerformed?: string;
}

export interface Participant {
  id: string;
  name: string;
  email?: string;
}

export interface CreateTournamentInput {
  name: string;
  description?: string;
  date: string;
  status?: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
}

export interface CreateParticipantInput {
  name: string;
  email?: string;
}

export interface CreateRoundInput {
  name: string;
  order: number;
  tournamentId: string;
}

export interface CreateMatchInput {
  roundId: string;
  participant1Id?: string;
  participant2Id?: string;
  songPerformed?: string;
}

export interface UpdateMatchInput {
  id: string;
  participant1Id?: string;
  participant2Id?: string;
  winnerId?: string;
  score1?: number;
  score2?: number;
  songPerformed?: string;
}
