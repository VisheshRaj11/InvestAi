export function RadialDotBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, transparent 0%, var(--background) 70%), radial-gradient(circle at center, #000000 1px, transparent 1px)',
          backgroundSize: '100% 100%, 24px 24px',
          opacity: 0.08
        }}
      />
    </div>
  );
}
