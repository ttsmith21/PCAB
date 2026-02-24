export type Season = "fall" | "winter" | "spring";

export interface Sport {
  name: string;
  gender: "boys" | "girls" | "coed";
  season: Season;
  levels: string[];
}

export const sports: Sport[] = [
  // Fall - Boys
  { name: "Football", gender: "boys", season: "fall", levels: ["Varsity", "JV", "Freshman"] },
  { name: "Soccer", gender: "boys", season: "fall", levels: ["Varsity", "JV"] },
  { name: "Tennis", gender: "boys", season: "fall", levels: ["Varsity"] },
  // Fall - Girls
  { name: "Soccer", gender: "girls", season: "fall", levels: ["Varsity", "JV"] },
  { name: "Tennis", gender: "girls", season: "fall", levels: ["Varsity"] },
  { name: "Volleyball", gender: "girls", season: "fall", levels: ["Varsity", "JV", "Freshman"] },
  { name: "Golf", gender: "girls", season: "fall", levels: ["Varsity"] },
  // Fall - Coed
  { name: "Cross Country", gender: "coed", season: "fall", levels: ["Varsity"] },
  { name: "Cheerleading", gender: "coed", season: "fall", levels: ["Varsity"] },
  // Winter - Boys
  { name: "Basketball", gender: "boys", season: "winter", levels: ["Varsity", "JV", "Freshman"] },
  { name: "Wrestling", gender: "boys", season: "winter", levels: ["Varsity"] },
  // Winter - Girls
  { name: "Basketball", gender: "girls", season: "winter", levels: ["Varsity", "JV", "Freshman"] },
  { name: "Wrestling", gender: "girls", season: "winter", levels: ["Varsity"] },
  // Winter - Coed
  { name: "Swimming", gender: "coed", season: "winter", levels: ["Varsity"] },
  { name: "Cheerleading", gender: "coed", season: "winter", levels: ["Varsity"] },
  // Spring - Boys
  { name: "Baseball", gender: "boys", season: "spring", levels: ["Varsity", "JV"] },
  { name: "Tennis", gender: "boys", season: "spring", levels: ["Varsity"] },
  { name: "Track & Field", gender: "boys", season: "spring", levels: ["Varsity"] },
  // Spring - Girls
  { name: "Softball", gender: "girls", season: "spring", levels: ["Varsity", "JV"] },
  { name: "Track & Field", gender: "girls", season: "spring", levels: ["Varsity"] },
];

export const seasonLabels: Record<Season, string> = {
  fall: "Fall",
  winter: "Winter",
  spring: "Spring",
};

export function getSportsBySeason(season: Season): Sport[] {
  return sports.filter((s) => s.season === season);
}
