export interface Initiative {
  title: string;
  description: string;
  image: string;
  category: string;
  featured?: boolean;
}

export const initiatives: Initiative[] = [
  {
    title: "The Fieldhouse",
    description:
      "A 26,000 sq ft indoor athletic facility featuring an indoor turf field, wrestling area, and strength & conditioning room. The Boosters contributed $400,000 toward the $1.2 million project, which opened in 2021 at 407 Short Street. This facility gives all Port Clinton athletes a year-round training home.",
    image: "/images/initiatives/fieldhouse.jpg",
    category: "Flagship",
    featured: true,
  },
  {
    title: "Stadium Lights",
    description:
      "Upgraded LED lighting for night games, ensuring safety and broadcast quality for our athletes and community.",
    image: "/images/initiatives/stadium-lights.jpg",
    category: "Facilities",
  },
  {
    title: "Weight Room Renovation",
    description:
      "New racks, weights, and flooring to build championship strength across all sports programs.",
    image: "/images/initiatives/weight-room.jpg",
    category: "Performance",
  },
  {
    title: "Scholarships",
    description:
      "Direct financial aid ensuring every student can participate in athletics regardless of family finances.",
    image: "/images/initiatives/scholarships.jpg",
    category: "Future",
  },
];
