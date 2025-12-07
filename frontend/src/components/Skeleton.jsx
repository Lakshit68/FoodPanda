export function Skeleton({ width = '100%', height = 16, rounded = 8, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: rounded,
        background: 'linear-gradient(90deg,#e5e7eb,#f3f4f6,#e5e7eb)',
        backgroundSize: '200% 100%',
        animation: 'ff-skeleton 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  )
}
