import Icon from './Icon'

type DailyMissionProps = { progress: number }

function DailyMission({ progress }: DailyMissionProps) {
  return (
    <article className="daily-mission">
      <div className="daily-mission__icon"><Icon name="clipboard" /></div>
      <div className="daily-mission__content">
        <h2>Misi Hari Ini</h2>
        <p>Selesaikan 3 level dengan nilai sempurna</p>
        <div className="daily-mission__progress-row">
          <div
            className="daily-mission__progress"
            role="progressbar"
            aria-label="Kemajuan misi harian"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={3}
          >
            <span style={{ width: `${(progress / 3) * 100}%` }} />
          </div>
          <span>{progress}/3</span>
        </div>
      </div>
      <Icon className="daily-mission__chevron" name="chevron" />
    </article>
  )
}

export default DailyMission
