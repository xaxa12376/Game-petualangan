import gameLogo from '../assets/game-logo.png'

function GameTitle() {
  return (
    <div className="game-title">
      <h1 className="visually-hidden">Petualangan Bangun Datar</h1>
      <img
        className="game-title__art"
        src={gameLogo}
        alt=""
        aria-hidden="true"
      />
    </div>
  )
}

export default GameTitle
