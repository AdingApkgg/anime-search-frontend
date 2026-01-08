export function Background() {
  return (
    <>
      {/* Gradient Pattern */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249, 115, 22, 0.12), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(245, 158, 11, 0.08), transparent),
            radial-gradient(ellipse 40% 30% at 10% 60%, rgba(249, 115, 22, 0.06), transparent)
          `
        }}
      />

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 -z-9 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </>
  )
}
