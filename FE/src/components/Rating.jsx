export function Rating({ label, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink">{label}</legend>
      <div className="grid grid-cols-5 gap-2 sm:flex">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            className={`focus-ring h-10 rounded-md border text-sm font-semibold ${
              value === level ? "border-leaf bg-leaf text-white" : "border-line bg-white text-ink"
            }`}
            onClick={() => onChange(level)}
            aria-pressed={value === level}
          >
            {level}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
