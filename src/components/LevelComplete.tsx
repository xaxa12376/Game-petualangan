import explorer from '../assets/game-explorer.png'

type Props = {
  level: number
  score: number
  earned: number
  correct: number
  total: number
  rewardCoins: number
  coins: number
  onContinue: () => void
  onRetry: () => void
}

export default function LevelComplete({ level, score, correct, total, coins, onContinue, onRetry }: Props) {
  return (
    <section className="level-screen level-result" aria-label={`Hasil level ${level}`}>
      <div className="level-result__confetti" aria-hidden="true">✦　·　✧　·　✦　·　✧</div>
      <div className="level-result__content">
        <div className="level-result__stars" aria-label="Tiga bintang emas"><span>★</span><span>★</span><span>★</span></div>
        <div className="level-result__banner"><h1>Level Selesai!</h1></div>
        <img className="level-result__mascot" src={explorer} alt="Satik melompat dengan gembira" />
        <article className="level-result__card" aria-label="Ringkasan hasil permainan">
          <div className="level-result__metrics">
            <div><span>⭐</span><strong>{score}</strong><small>Skor</small></div>
            <div><span>🪙</span><strong>{coins + 100}</strong><small>Koin</small></div>
            <div><span>🔵</span><strong>+100</strong><small>XP</small></div>
          </div>
          <div className="level-result__answers"><span>Jawaban</span><strong><i aria-hidden="true">✓</i>{correct} benar / {total}</strong></div>
        </article>
        <div className="level-result__actions">
          <button className="game-action game-action--green" onClick={onContinue} type="button">Lanjutkan</button>
          <button className="game-action game-action--white" onClick={onRetry} type="button"><span aria-hidden="true">↻</span> Ulangi</button>
        </div>
      </div>
    </section>
  )
}
