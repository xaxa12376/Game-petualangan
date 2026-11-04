import explorerImage from '../assets/game-explorer.png'

type PlayerProfileProps = { level: number }

function PlayerProfile({ level }: PlayerProfileProps) {
  const progress = Math.round(((level - 1) / 29) * 100)

  return (
    <section className="player-profile" aria-label="Profil pemain">
      <div className="player-profile__avatar" aria-hidden="true"><img src={explorerImage} alt="" /></div>
      <div className="player-profile__details">
        <span className="player-profile__eyebrow">Siswa</span>
        <strong>Satik</strong>
        <div className="player-profile__progress" role="progressbar" aria-label="Kemajuan petualangan" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="player-profile__level">Level {level}</span>
      </div>
    </section>
  )
}

export default PlayerProfile
