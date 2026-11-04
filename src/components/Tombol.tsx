import type { ButtonHTMLAttributes, ReactNode } from 'react'

type TombolProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  icon?: ReactNode
  variant?: 'primary' | 'icon'
}

function Tombol({
  children,
  className = '',
  icon,
  type = 'button',
  variant = 'primary',
  ...props
}: TombolProps) {
  return (
    <button
      className={`game-button game-button--${variant} ${className}`.trim()}
      type={type}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default Tombol