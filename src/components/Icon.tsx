import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'book'
  | 'chevron'
  | 'clipboard'
  | 'coin'
  | 'gem'
  | 'home'
  | 'map'
  | 'play'
  | 'plus'
  | 'settings'
  | 'star'
  | 'trophy'
  | 'user'

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
}

function Icon({ name, ...props }: IconProps) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
  }

  const paths: Record<IconName, ReactNode> = {
    book: (
      <g {...commonProps}>
        <path d="M12 7v14m0-14C9.7 5.2 6.5 5 3 6v14c3.5-1 6.7-.8 9 1m0-14c2.3-1.8 5.5-2 9-1v14c-3.5-1-6.7-.8-9 1" />
      </g>
    ),
    chevron: (
      <path
        d="m9 5 7 7-7 7"
        {...commonProps}
        strokeWidth="2.8"
      />
    ),
    clipboard: (
      <g {...commonProps}>
        <rect x="5" y="4" width="14" height="18" rx="2" />
        <path d="M9 4V2h6v2M8 10h8m-8 4h8m-8 4h5" />
      </g>
    ),
    coin: (
      <g {...commonProps}>
        <circle cx="12" cy="12" r="9" fill="#ffc83d" stroke="#e89a18" />
        <circle cx="12" cy="12" r="5.6" stroke="#fff4b4" strokeWidth="1.6" />
      </g>
    ),
    gem: (
      <path
        d="m12 2 8.5 6-8.5 14L3.5 8 12 2Zm-8.5 6h17M8 2l4 20 4-20"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    ),
    home: (
      <path
        d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
    map: (
      <g {...commonProps}>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15m6-12v15" />
      </g>
    ),
    play: (
      <path
        d="M7 4.8c0-1 1.1-1.6 2-1.1l11.1 6.8a1.7 1.7 0 0 1 0 2.9L9 20.2c-.9.6-2-.1-2-1.1V4.8Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    ),
    plus: <path d="M12 5v14M5 12h14" {...commonProps} strokeWidth="3" />,
    settings: (
      <g {...commonProps}>
        <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        <path d="m19.4 13.5 1.1.9-1.5 2.6-1.4-.5a7 7 0 0 1-1.5.9l-.3 1.5h-3l-.3-1.5a7 7 0 0 1-1.5-.9l-1.4.5-1.5-2.6 1.1-.9a6 6 0 0 1 0-1.8l-1.1-.9 1.5-2.6 1.4.5a7 7 0 0 1 1.5-.9l.3-1.5h3l.3 1.5a7 7 0 0 1 1.5.9l1.4-.5 1.5 2.6-1.1.9a6 6 0 0 1 0 1.8Z" />
      </g>
    ),
    star: (
      <path
        d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 9.4l6.3-.9L12 2.8Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    ),
    trophy: (
      <g {...commonProps}>
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Zm5 10v5m-4 2h8m-4-2h-3m8-12h3v3a4 4 0 0 1-4 4M7 7H4v3a4 4 0 0 0 4 4" />
      </g>
    ),
    user: (
      <g {...commonProps}>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z" />
      </g>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}

export default Icon
