import { useEffect } from 'react'
import Icon from './Icon'
import PlayerProfile from './PlayerProfile'
import ResourceCounter from './ResourceCounter'

type AdventureMapProps = {
  notice: string
  unlockedLevel: number
  completedLevels: number[]
  starCount: number
  coinCount: number
  onBack: () => void
  onSelectLevel: (level: number) => void
  onShowMission: () => void
  onShowCollection: () => void
  onDismissNotice: () => void
}

type MapLevel = { level: number; x: number; y: number }

// Seluruh node level ditempatkan mengikuti jalur pada peta lima pulau.
const levels: MapLevel[] = [
  { level: 1, x: 15.9, y: 23.4 }, { level: 2, x: 30.2, y: 23.5 }, { level: 3, x: 42.0, y: 24.9 },
  { level: 4, x: 10.5, y: 31.8 }, { level: 5, x: 25.5, y: 32.4 }, { level: 6, x: 40.8, y: 31.8 },
  { level: 7, x: 65.9, y: 32.2 }, { level: 8, x: 75.5, y: 34.5 }, { level: 9, x: 83.9, y: 34.8 },
  { level: 10, x: 62.1, y: 38.0 }, { level: 11, x: 75.5, y: 40.5 }, { level: 12, x: 88.3, y: 40.8 },
  { level: 13, x: 18.0, y: 55.6 }, { level: 14, x: 30.4, y: 55.5 }, { level: 15, x: 42.0, y: 56.2 },
  { level: 16, x: 18.8, y: 61.6 }, { level: 17, x: 29.5, y: 61.5 }, { level: 18, x: 40.0, y: 61.4 },
  { level: 19, x: 66.8, y: 64.9 }, { level: 20, x: 77.5, y: 66.5 }, { level: 21, x: 88.7, y: 64.9 },
  { level: 22, x: 69.2, y: 70.4 }, { level: 23, x: 80.3, y: 71.2 }, { level: 24, x: 90.4, y: 70.8 },
  { level: 25, x: 41.3, y: 87.4 }, { level: 26, x: 50.3, y: 87.4 }, { level: 27, x: 59.6, y: 87.4 },
  { level: 28, x: 41.8, y: 92.2 }, { level: 29, x: 50.8, y: 92.2 }, { level: 30, x: 60.4, y: 92.2 },
]

function AdventureMap({ notice, unlockedLevel, completedLevels, starCount, coinCount, onBack, onSelectLevel, onShowMission, onShowCollection, onDismissNotice }: AdventureMapProps) {
  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(onDismissNotice, 3200)
    return () => window.clearTimeout(timeout)
  }, [notice, onDismissNotice])

  return (
    <section className="adventure-map" aria-label="Peta petualangan">
      <header className="adventure-map__hud" aria-label="Status pemain">
        <PlayerProfile level={unlockedLevel} />
        <div className="adventure-map__resources" aria-label="Sumber daya pemain">
          <ResourceCounter icon="star" label="bintang" value={starCount} />
          <ResourceCounter icon="coin" label="koin" value={coinCount} />
          <span className="game-header__settings" aria-label="Pengaturan"><Icon name="settings" /></span>
        </div>
      </header>
      <div className="adventure-map__artwork">
        <img src="/adventure-map.jpg" alt="Peta petualangan lima pulau dengan tiga puluh level bangun datar" />
        <button className="adventure-map__back" type="button" onClick={onBack} aria-label="Kembali ke beranda">
          <Icon name="chevron" />
        </button>
        <button className="adventure-map__mission-link" onClick={onShowMission} type="button" aria-label="Lihat misi harian" />
        <button className="adventure-map__collection-link" onClick={onShowCollection} type="button" aria-label="Lihat koleksi bintang" />
        {levels.map(({ level, x, y }) => {
          const completed = completedLevels.includes(level)
          const locked = level > unlockedLevel
          const current = level === unlockedLevel
          const marker = completed || current ? '★' : String(level)
          return (
            <button
              aria-label={`Level ${level}${completed ? ', selesai' : locked ? ', terkunci' : ', terbuka'}`}
              className={`adventure-map__hotspot${locked ? ' is-locked' : ''}${completed ? ' is-completed' : ''}${current ? ' is-current' : ''}`}
              data-level={level}
              disabled={locked}
              key={level}
              onClick={() => { if (!locked) onSelectLevel(level) }}
              style={{ left: `${x}%`, top: `${y}%` }}
              type="button"
            >
              <span className="adventure-map__badge">{marker}</span>
            </button>
          )
        })}
      </div>
      {notice && <button className="adventure-map__notice" onClick={onDismissNotice} type="button">{notice}<span aria-hidden="true"> ×</span></button>}
    </section>
  )
}

export default AdventureMap





