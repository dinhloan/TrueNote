export function TextAreaField({ label, value, onChange, rows = 6, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <textarea
        className="focus-ring min-h-32 w-full rounded-md border border-line bg-white px-4 py-3 leading-7 text-ink shadow-sm"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
