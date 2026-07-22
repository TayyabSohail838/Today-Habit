export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && <Icon className="w-10 h-10 text-muted-foreground mb-3" />}
      <h3 className="text-foreground font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground text-sm mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
