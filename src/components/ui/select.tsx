import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-400">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full h-12 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white",
          "focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600",
          "transition-all duration-200",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
