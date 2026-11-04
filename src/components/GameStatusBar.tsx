type Props = { score: number; coins: number; onBack: () => void }
export default function GameStatusBar({ score, coins, onBack }: Props) {
  return <header className="game-status" aria-label="Status permainan">
    <button className="game-status__back" onClick={onBack} type="button" aria-label="Kembali"><span>‹</span></button>
    <div className="game-status__counter"><span aria-hidden="true">⭐</span><strong>{score}</strong></div>
    <div className="game-status__counter game-status__counter--coin"><span aria-hidden="true">🪙</span><strong>{coins}</strong></div>
  </header>
}
