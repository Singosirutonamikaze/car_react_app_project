import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-blue-100"
      >
        {label}
      </label>

      <input
        id={inputId}
        className={`w-full px-4 py-3 bg-blue-800/40 border rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? "border-red-500" : "border-blue-600/50"
          }`}
        {...props}
      />

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}

export default Input;