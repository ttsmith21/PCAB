export interface Initiative {
  title: string;
  description: string;
  image: string;
  category: string;
}

export const initiatives: Initiative[] = [
  {
    title: "Stadium Lights",
    description: "Upgraded LED lighting for night games, ensuring safety and broadcast quality for our athletes and community.",
    image: "/images/initiatives/stadium-lights.jpg",
    category: "Facilities",
  },
  {
    title: "Weight Room Renovation",
    description: "New racks, weights, and flooring to build championship strength across all sports programs.",
    image: "/images/initiatives/weight-room.jpg",
    category: "Performance",
  },
  {
    title: "Scholarships",
    description: "Direct financial aid ensuring every student can participate in athletics regardless of family finances.",
    image: "/images/initiatives/scholarships.jpg",
    category: "Future",
  },
];
