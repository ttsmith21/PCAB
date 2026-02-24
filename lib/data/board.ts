export interface BoardMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export const boardMembers: BoardMember[] = [
  { name: "Tyson Smith", role: "President" },
  { name: "Brennan Madison", role: "Vice President" },
  { name: "Terry Dunn", role: "Treasurer" },
];
