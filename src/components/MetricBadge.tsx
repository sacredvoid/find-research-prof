export default function MetricBadge({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string | number;
  compact?: boolean;
}) {
  return (
    <span className={`bg-gold-bg rounded-md ${compact ? "px-2 py-0.5 sm:px-2.5 sm:py-1" : "px-2.5 py-1"}`}>
      <span className="text-gold font-semibold">{value}</span>
      <span className="text-gold-muted font-sans text-xs ml-1">{label}</span>
    </span>
  );
}
