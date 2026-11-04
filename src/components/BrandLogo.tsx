/** Previous refined vector logo. Variant names describe the ink color. */
export function BrandLogo({
  variant = 'dark',
  iconOnly = false,
}: {
  variant?: 'dark' | 'light'
  iconOnly?: boolean
}) {
  return (
    <img
      className="brand-logo"
      src={`/brand/ragnor-${iconOnly ? 'sigil' : 'logo'}-${variant}.svg?v=3`}
      alt="RAGNOR"
      width={iconOnly ? 86 : 281}
      height={83}
      decoding="async"
    />
  )
}
