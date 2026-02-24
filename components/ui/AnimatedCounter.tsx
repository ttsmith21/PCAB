"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({
  end,
  label,
  prefix = "",
  suffix = "",
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold font-oswald text-pc-red">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 uppercase tracking-wider mt-2 font-oswald">
        {label}
      </div>
    </div>
  );
}
