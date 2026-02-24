interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeading({ title, subtitle, light = false }: SectionHeadingProps) {
  return (
    <div className="max-w-4xl mx-auto text-center mb-12">
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${light ? "text-white" : "text-gray-900"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${light ? "text-gray-300" : "text-gray-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
