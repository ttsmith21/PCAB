"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-oswald text-lg font-bold uppercase pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-pc-red flex-shrink-0 transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? "max-h-96 pb-6" : "max-h-0"
            }`}
          >
            <p className="px-6 text-gray-600 leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
