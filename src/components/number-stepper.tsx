"use client";

interface NumberStepperProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  className?: string;
}

export function NumberStepper({
  id,
  value,
  onChange,
  min,
  max,
  disabled,
  className = "",
}: NumberStepperProps) {
  function clamp(v: number) {
    return Math.min(Math.max(v, min), max);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") {
      onChange(min);
      return;
    }
    const n = parseInt(raw, 10);
    if (!isNaN(n)) onChange(clamp(n));
  }

  return (
    <div
      className={`inline-flex items-stretch rounded-lg border border-zinc-800 bg-zinc-900 ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease"
        className="flex w-9 items-center justify-center rounded-l-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-700 disabled:hover:bg-transparent"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleInput}
        disabled={disabled}
        className="w-12 border-x border-zinc-800 bg-transparent px-1 py-2.5 text-center text-sm text-zinc-100 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase"
        className="flex w-9 items-center justify-center rounded-r-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-700 disabled:hover:bg-transparent"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
