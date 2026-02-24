interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 ${
        hover ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
