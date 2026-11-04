import DailyMission from './DailyMission'
import Icon from './Icon'
import PlayerProfile from './PlayerProfile'
import ResourceCounter from './ResourceCounter'

function GameHeader({ starCount = 120, coinCount = 45, missionProgress = 1, playerLevel = 3 }: { starCount?: number; coinCount?: number; missionProgress?: number; playerLevel?: number }) {
  return (
    <header className="game-header">
      <PlayerProfile level={playerLevel} />
      <div className="game-header__right">
        <div className="game-header__resources" aria-label="Sumber daya">
          <ResourceCounter icon="star" label="bintang" value={starCount} />
          <ResourceCounter icon="coin" label="koin" value={coinCount} />
          <span className="game-header__settings" aria-label="Pengaturan">
            <Icon name="settings" />
          </span>
        </div>
        <DailyMission progress={missionProgress} />
      </div>
    </header>
  )
}

export default GameHeader



