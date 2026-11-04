export function ProductImagePending({ name }: { name: string }) {
  return (
    <div
      className="product-image pending-photography"
      role="img"
      aria-label={`${name}: approved product photography pending`}
    >
      <span className="eyebrow">THE FIRST SAGA</span>
      <p>Photography pending approval</p>
      <span className="muted">{name}</span>
    </div>
  )
}
