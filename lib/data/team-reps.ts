export interface TeamRep {
  sport: string;
  name: string;
  email: string;
}

export const teamReps: TeamRep[] = [
  { sport: "Football", name: "John Doe", email: "football@example.com" },
  { sport: "Basketball (Boys)", name: "Mike Smith", email: "bball@example.com" },
  { sport: "Basketball (Girls)", name: "Jane Miller", email: "gball@example.com" },
  { sport: "Soccer", name: "Sarah Jones", email: "soccer@example.com" },
];
