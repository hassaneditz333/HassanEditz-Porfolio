import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  options: { value: string; label: string }[];
  name: string;
  placeholder: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function CustomSelect({ options, name, placeholder, required, value, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);

  // Special package labels
  const specialLabels: Record<string, string> = {
    starter: 'Starter ($50/video)',
    professional: 'Professional ($149/video)',
    signature: 'Signature ($299/video)'
  };

  // If value is a special package, show its label, but do not show as option
  const displayLabel = value && specialLabels[value]
    ? specialLabels[value]
    : options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="relative w-full max-w-xs">
      <button
        type="button"
        className={`w-full bg-black/30 border border-cyan-400/30 rounded-xl px-3 py-2 text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 focus:shadow-[0_0_12px_2px_rgba(6,182,212,0.18)] transition-all ${open ? 'ring-2 ring-cyan-400/60 border-cyan-400 shadow-[0_0_12px_2px_rgba(6,182,212,0.18)]' : ''}`}
        style={{ minWidth: 160 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "" : "text-gray-400"}>{displayLabel}</span>
        <ChevronDown size={20} className="text-cyan-400 ml-2" />
      </button>
      {open && (
        <ul className="absolute left-0 mt-2 w-full bg-black/90 rounded-xl shadow-lg z-10 border border-white/10">
          {options.map((opt) => (
            <li
              key={opt.value}
              className="px-4 py-3 text-white hover:bg-cyan-400/10 cursor-pointer transition-all"
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={value === opt.value}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      <input type="hidden" name={name} value={value} required={required} />
    </div>
  );
}
