import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  external?: boolean;
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const base =
    "font-oswald inline-block font-bold text-sm tracking-wider uppercase py-3 px-8 rounded-full transition-all duration-300 text-center";

  const variants = {
    primary: "bg-pc-red text-white hover:bg-pc-red-dark hover:shadow-glow hover:-translate-y-0.5 shadow-md",
    secondary: "bg-pc-dark text-white hover:bg-black hover:shadow-lg hover:-translate-y-0.5",
    outline: "border-2 border-pc-red text-pc-red hover:bg-pc-red hover:text-white",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
