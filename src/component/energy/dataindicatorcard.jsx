export default function DataIndicatorCard({ icon: Icon, label, value, status = "normal" }) {
  const statusStyles = {
    good: "text-energy-green",
    warning: "text-energy-red",
    normal: "text-energy-blue",
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        {Icon ? <Icon className={`h-4 w-4 ${statusStyles[status] || statusStyles.normal}`} /> : null}
      </div>
      <div className="font-heading text-2xl font-bold">{value}</div>
      <div className={`text-xs mt-1 ${statusStyles[status] || statusStyles.normal}`}>
        {status.toUpperCase()}
      </div>
    </div>
  );
}

