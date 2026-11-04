import Icon, { type IconName } from './Icon'

export type NavigationItem = 'Beranda' | 'Peta' | 'Prestasi' | 'Materi' | 'Profil'

type NavigationEntry = {
  icon: IconName
  label: NavigationItem
}

type BottomNavigationProps = {
  activeItem: NavigationItem
  onSelect: (item: NavigationItem) => void
}

const navigationItems: NavigationEntry[] = [
  { icon: 'home', label: 'Beranda' },
  { icon: 'map', label: 'Peta' },
  { icon: 'trophy', label: 'Prestasi' },
  { icon: 'book', label: 'Materi' },
  { icon: 'user', label: 'Profil' },
]

function BottomNavigation({ activeItem, onSelect }: BottomNavigationProps) {
  return (
    <nav className="bottom-navigation" aria-label="Navigasi utama">
      {navigationItems.map(({ icon, label }) => (
        <button
          aria-current={activeItem === label ? 'page' : undefined}
          className={`bottom-navigation__item${activeItem === label ? ' is-active' : ''}`}
          key={label}
          onClick={() => onSelect(label)}
          type="button"
        >
          <Icon name={icon} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNavigation
