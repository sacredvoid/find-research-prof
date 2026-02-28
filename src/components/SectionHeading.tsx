export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.7rem] font-medium text-ink-tertiary uppercase tracking-widest mb-3">
      {children}
    </h2>
  );
}
