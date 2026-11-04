import GameStatusBar from './GameStatusBar'
import explorer from '../assets/game-explorer.png'
import sign from '../assets/game-sign.png'

type Props = { level: number; completed: boolean; score: number; coins: number; onBack: () => void; onStart: () => void }
export default function LevelDetail({ level, completed, score, coins, onBack, onStart }: Props) {
  return <section className="level-screen level-detail" aria-label={`Detail level ${level}`}>
    <GameStatusBar score={score} coins={coins} onBack={onBack} />
    <div className="level-detail__heading"><span>GERBANG PULAU</span><h1>Level {level}: Gerbang Pulau Bentuk</h1></div>
    <article className="level-detail__info">
      <strong>Tujuan pembelajaran</strong><p>Mengenali persegi, segitiga, persegi panjang, dan lingkaran.</p>
      <div className="level-detail__stars" aria-label="Target empat bintang">☆ ☆ ☆ ☆</div>
      <div className="level-detail__meta"><span>◷ &nbsp;3–5 menit</span><span>◎ &nbsp;3 tantangan</span></div>
    </article>
    <div className="level-detail__scene" aria-label="Maskot menuju gerbang istana">
      <img className="level-detail__sign" src={sign} alt="Papan petunjuk" /><img className="level-detail__hero" src={explorer} alt="Maskot segitiga penjelajah" />
    </div>
    <div className="level-detail__bottom">{completed && <p>Level ini sudah pernah diselesaikan. Kamu bisa bermain lagi!</p>}<button className="game-action game-action--yellow" onClick={onStart} type="button">Mulai <span>➜</span></button></div>
  </section>
}
