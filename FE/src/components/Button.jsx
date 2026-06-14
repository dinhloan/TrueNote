export function Button({ variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-leaf text-white hover:bg-leaf/90",
    secondary: "border border-line bg-white text-ink hover:bg-mist",
    ghost: "text-ink hover:bg-white"
  };

  return (
    <button
      className={`focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
