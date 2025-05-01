import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Tournament: a.model({
    id: a.id(),
    name: a.string().required(),
    description: a.string(),
    date: a.datetime().required(),
    status: a.enum(["UPCOMING", "IN_PROGRESS", "COMPLETED"]),
    rounds: a.hasMany("Round", "tournamentId"),
  }).authorization((allow) => [
    allow.publicApiKey(),
  ]),

  Round: a.model({
    id: a.id(),
    name: a.string().required(),
    order: a.integer().required(),
    tournamentId: a.id().required(),
    tournament: a.belongsTo("Tournament", "tournamentId"),
    matches: a.hasMany("Match", "roundId"),
  }).authorization((allow) => [
    allow.publicApiKey(),
  ]),

  Match: a.model({
    id: a.id(),
    roundId: a.id().required(),
    round: a.belongsTo("Round", "roundId"),
    participant1Id: a.id(),
    participant1: a.belongsTo("Participant", "participant1Id"),
    participant2Id: a.id(),
    participant2: a.belongsTo("Participant", "participant2Id"),
    winnerId: a.id(),
    winner: a.belongsTo("Participant", "winnerId"),
    score1: a.integer(),
    score2: a.integer(),
    songPerformed: a.string(),
  }).authorization((allow) => [
    allow.publicApiKey(),
  ]),

  Participant: a.model({
    id: a.id(),
    name: a.string().required(),
    email: a.string(),
    matches1: a.hasMany("Match", "participant1Id"),
    matches2: a.hasMany("Match", "participant2Id"),
    wins: a.hasMany("Match", "winnerId"),
  }).authorization((allow) => [
    allow.publicApiKey(),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
