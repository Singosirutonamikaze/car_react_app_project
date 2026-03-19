import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly error?: string;
}

function Input({ label, error, id, ...props }: Readonly<InputProps>) {
  const inputId = id || `input-${label.replaceAll(" ", "-").toLowerCase()}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium client-theme-label"
      >
        {label}
      </label>

      <input
        id={inputId}
        className={`w-full px-4 py-3 border rounded-full client-theme-input focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all ${error ? "border-red-500" : ""
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