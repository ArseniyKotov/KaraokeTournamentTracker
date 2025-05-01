import { format, addDays } from 'date-fns';

export const mockTournaments = [
  {
    name: "Summer Karaoke Showdown",
    description: "Annual summer karaoke competition with friends",
    date: new Date().toISOString(),
    status: "UPCOMING"
  },
  {
    name: "Holiday Sing-Off",
    description: "Festive karaoke tournament with holiday songs",
    date: addDays(new Date(), 30).toISOString(),
    status: "UPCOMING"
  }
];

export const mockParticipants = [
  { name: "Alex Johnson", email: "alex@example.com" },
  { name: "Jamie Smith", email: "jamie@example.com" },
  { name: "Taylor Brown", email: "taylor@example.com" },
  { name: "Jordan Lee", email: "jordan@example.com" },
  { name: "Casey Wilson", email: "casey@example.com" },
  { name: "Riley Garcia", email: "riley@example.com" },
  { name: "Morgan Chen", email: "morgan@example.com" },
  { name: "Drew Patel", email: "drew@example.com" }
];

export const seedDatabase = async (client: any) => {
  // Check if we've already seeded
  const { data: existingTournaments } = await client.models.Tournament.list({ limit: 1 });
  
  if (existingTournaments.length > 0) {
    console.log("Database already has data, skipping seed");
    return;
  }
  
  console.log("Seeding database with mock data...");
  
  // Create tournaments
  const createdTournaments = [];
  for (const tournament of mockTournaments) {
    const { data: newTournament } = await client.models.Tournament.create(tournament);
    createdTournaments.push(newTournament);
  }
  
  // Create participants
  const createdParticipants = [];
  for (const participant of mockParticipants) {
    const { data: newParticipant } = await client.models.Participant.create(participant);
    createdParticipants.push(newParticipant);
  }
  
  // Create rounds for the first tournament
  const tournament = createdTournaments[0];
  const rounds = [
    { name: "Quarter Finals", order: 1, tournamentId: tournament.id },
    { name: "Semi Finals", order: 2, tournamentId: tournament.id },
    { name: "Finals", order: 3, tournamentId: tournament.id }
  ];
  
  const createdRounds = [];
  for (const round of rounds) {
    const { data: newRound } = await client.models.Round.create(round);
    createdRounds.push(newRound);
  }
  
  // Create matches for quarter finals
  const quarterFinals = createdRounds[0];
  const quarterFinalMatches = [
    {
      roundId: quarterFinals.id,
      participant1Id: createdParticipants[0].id,
      participant2Id: createdParticipants[1].id,
      songPerformed: "Bohemian Rhapsody"
    },
    {
      roundId: quarterFinals.id,
      participant1Id: createdParticipants[2].id,
      participant2Id: createdParticipants[3].id,
      songPerformed: "Don't Stop Believin'"
    },
    {
      roundId: quarterFinals.id,
      participant1Id: createdParticipants[4].id,
      participant2Id: createdParticipants[5].id,
      songPerformed: "Sweet Caroline"
    },
    {
      roundId: quarterFinals.id,
      participant1Id: createdParticipants[6].id,
      participant2Id: createdParticipants[7].id,
      songPerformed: "Livin' on a Prayer"
    }
  ];
  
  for (const match of quarterFinalMatches) {
    await client.models.Match.create(match);
  }
  
  console.log("Database seeding complete!");
};
