export interface BoardMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export const officers: BoardMember[] = [
  { name: "Tyson Smith", role: "President" },
  { name: "Brennan Madison", role: "Vice President" },
  { name: "Terry Dunn", role: "Treasurer" },
  { name: "Kelly Shirkey", role: "Secretary" },
];

export const trustees: BoardMember[] = [
  { name: "Brandon Fitt", role: "Trustee" },
  { name: "Logan Meisler", role: "Trustee" },
  { name: "Chris Mazur", role: "Trustee" },
  { name: "Steve Dearth", role: "Trustee" },
  { name: "Ted Wierzba", role: "Trustee" },
  { name: "Steve Wagner", role: "Trustee" },
  { name: "Matt Franks", role: "Trustee" },
  { name: "Martin Rosemond", role: "Trustee" },
];

export const boardMembers: BoardMember[] = [...officers, ...trustees];
