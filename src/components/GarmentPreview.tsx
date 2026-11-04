import { useId } from 'react'
import type { Garment } from '../lib/catalog'
export function GarmentPreview({
  garment = 'T-shirt',
  color = '#282925',
  artwork = 'origin',
  scale = 1,
  className = '',
}: {
  garment?: Garment
  color?: string
  artwork?: string
  scale?: number
  className?: string
}) {
  const id = useId().replaceAll(':', '')
  const light = color === '#e6e0d1'
  return (
    <svg
      viewBox="0 0 460 500"
      role="img"
      aria-label={`${garment} concept mockup with ${artwork} artwork`}
      className={`garment ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-fabric`} x1="0" x2="1">
          <stop stopColor="#fff" stopOpacity=".1" />
          <stop offset=".4" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-40%" width="180%" y="-20%" height="150%">
          <feDropShadow dx="0" dy="18" stdDeviation="14" floodOpacity=".16" />
        </filter>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        <path
          className="garment-fabric"
          d={
            garment === 'Hoodie'
              ? 'M164 102 Q155 23 230 22 Q305 23 296 102 L344 123 L411 358 L351 377 L308 238 L312 457 Q230 472 148 457 L152 238 L109 377 L49 358 L116 123Z'
              : 'M160 79 L183 69 Q230 99 277 69 L300 79 L395 135 L350 228 L306 207 L312 445 Q230 460 148 445 L154 207 L110 228 L65 135Z'
          }
          fill={color}
        />
        <path
          d={
            garment === 'Hoodie'
              ? 'M164 102 Q155 23 230 22 Q305 23 296 102 L344 123 L411 358 L351 377 L308 238 L312 457 Q230 472 148 457 L152 238 L109 377 L49 358 L116 123Z'
              : 'M160 79 L183 69 Q230 99 277 69 L300 79 L395 135 L350 228 L306 207 L312 445 Q230 460 148 445 L154 207 L110 228 L65 135Z'
          }
          fill={`url(#${id}-fabric)`}
        />
        <path
          d={
            garment === 'Hoodie'
              ? 'M180 100 Q230 27 280 100 Q230 133 180 100 M203 112 L200 181 M257 112 L260 181 M182 360 L171 417 L289 417 L278 360Z'
              : 'M183 70 Q230 130 277 70 M181 78 Q230 140 279 78'
          }
          fill="none"
          stroke={light ? '#8f897d' : '#777973'}
          strokeOpacity=".45"
          strokeWidth="2"
        />
        <path
          d="M155 220 L165 430 M305 220 L295 430 M152 439 Q230 451 308 439"
          fill="none"
          stroke={light ? '#a9a394' : '#8d8d80'}
          strokeOpacity=".15"
        />
        <g
          className="garment-artwork"
          transform={`translate(230 246) scale(${scale})`}
          fill={light ? '#30312c' : '#e5dfd2'}
        >
          {artwork === 'raven' ? (
            <>
              <image
                href={`/brand/ragnor-sigil-${light ? 'dark' : 'light'}.svg`}
                x="-42"
                y="-58"
                width="84"
                height="79"
              />
              <text y="44" textAnchor="middle" fontSize="16" fontWeight="600" letterSpacing="5">
                RAGNOR
              </text>
              <path d="M-5 61 L0 53 L5 61Z" fill="#CB5A3C" />
            </>
          ) : artwork === 'terrain' ? (
            <>
              <circle r="60" fill="#b55735" />
              {[-30, -15, 0, 15, 30].map((y) => (
                <path
                  key={y}
                  d={`M-65 ${y} Q-25 ${y - 40} 0 ${y} T65 ${y}`}
                  fill="none"
                  stroke={light ? '#ddd7c8' : '#252623'}
                  strokeWidth="3"
                />
              ))}
              <text y="88" textAnchor="middle" fontSize="10" letterSpacing="4">
                UNKNOWN TERRAIN
              </text>
            </>
          ) : artwork === 'orbit' ? (
            <>
              <circle
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                style={{ color: light ? '#3b3b35' : '#ded8cd' }}
              />
              <ellipse
                rx="73"
                ry="25"
                transform="rotate(-35)"
                fill="none"
                stroke="#c76540"
                strokeWidth="8"
              />
              <text y="83" textAnchor="middle" fontSize="12" letterSpacing="5">
                OUT OF ORBIT
              </text>
            </>
          ) : (
            <>
              <text y="0" textAnchor="middle" fontSize="23" fontWeight="700" letterSpacing="4">
                RAGNOR
              </text>
              <text y="18" textAnchor="middle" fontSize="6" letterSpacing="3">
                IMAGINE IT. WEAR IT.
              </text>
              <path d="M-9 36 L0 22 L9 36Z" fill="#b95735" />
            </>
          )}
        </g>
      </g>
    </svg>
  )
}
