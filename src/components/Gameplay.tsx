import { useEffect, useMemo, useRef, useState } from 'react'
import GameStatusBar from './GameStatusBar'
import { questionsForLevel } from '../data/questions'
import worldUrl from '../assets/game-world.png'
import spriteUrl from '../assets/satik-animations.png'
import quizHouse from '../assets/quiz-house.png'

type Result = { score: number; earned: number; correct: number; total: number; rewardCoins: number; coinBonus: number }
type Props = { level: number; score: number; coins: number; onBack: () => void; onComplete: (result: Result) => void }
type Direction = 'left' | 'right' | 'jump'
type Runtime = { x: number; y: number; vx: number; vy: number; grounded: boolean; facing: 1 | -1; jumpHeld: boolean; lastTime: number; paused: boolean; collected: string[]; foundCoins: number; score: number; correct: number }
type QuizFeedback = { correct: boolean; text: string } | null

const initialRuntime = (): Runtime => ({ x: 30, y: -1, vx: 0, vy: 0, grounded: false, facing: 1, jumpHeld: false, lastTime: 0, paused: false, collected: [], foundCoins: 0, score: 0, correct: 0 })

function drawShape(ctx: CanvasRenderingContext2D, shape: string, x: number, y: number, size: number) {
  ctx.save(); ctx.translate(x, y); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.shadowColor = '#163e6235'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 4
  ctx.fillStyle = shape === 'triangle' ? '#ffc12c' : shape === 'square' ? '#26a5e8' : shape === 'circle' ? '#f05c8b' : '#48bd68'; ctx.strokeStyle = '#fff'
  ctx.beginPath()
  if (shape === 'triangle') { ctx.moveTo(0, -size / 2); ctx.lineTo(size / 2, size / 2); ctx.lineTo(-size / 2, size / 2); ctx.closePath() }
  else if (shape === 'circle') ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
  else if (shape === 'rectangle') ctx.roundRect(-size / 2, -size / 3, size, size * 2 / 3, 5)
  else ctx.roundRect(-size / 2, -size / 2, size, size, 5)
  ctx.fill(); ctx.stroke(); ctx.restore()
}

function drawIslandTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, scale: number) {
  const s = Math.max(.72, Math.min(1, scale))
  ctx.save()
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#70452b'; ctx.lineWidth = 5 * s
  ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x + 1 * s, groundY - 19 * s); ctx.stroke()
  ctx.strokeStyle = '#845332'; ctx.lineWidth = 2 * s
  ctx.beginPath(); ctx.moveTo(x, groundY - 10 * s); ctx.lineTo(x - 7 * s, groundY - 17 * s); ctx.moveTo(x + 1 * s, groundY - 12 * s); ctx.lineTo(x + 8 * s, groundY - 18 * s); ctx.stroke()
  const crownY = groundY - 27 * s
  const blobs = [
    { dx: 0, dy: -5, r: 12, color: '#25974e' }, { dx: -8, dy: 0, r: 9, color: '#40b94f' },
    { dx: 8, dy: 1, r: 9, color: '#55c957' }, { dx: -2, dy: -10, r: 8, color: '#83db4d' },
    { dx: 5, dy: -7, r: 7, color: '#6dcc45' },
  ]
  blobs.forEach(blob => { ctx.beginPath(); ctx.arc(x + blob.dx * s, crownY + blob.dy * s, blob.r * s, 0, Math.PI * 2); ctx.fillStyle = blob.color; ctx.fill() })
  ctx.restore()
}

export default function Gameplay({ level, score, coins, onBack, onComplete }: Props) {
  const levelQuestions = useMemo(() => questionsForLevel(level), [level])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtime = useRef<Runtime>(initialRuntime())
  const directions = useRef<Record<Direction, boolean>>({ left: false, right: false, jump: false })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [choice, setChoice] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<QuizFeedback>(null)
  const [collectedCount, setCollectedCount] = useState(0)
  const [scoreEarned, setScoreEarned] = useState(0)
  const [coinEarned, setCoinEarned] = useState(0)
  const question = levelQuestions.find(item => item.id === activeId)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const world = new Image(); world.src = worldUrl
    const sprites = new Image(); sprites.src = spriteUrl
    let frame = 0
    let width = 0
    let height = 0
    const playerW = 56
    const playerH = 76

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width); height = Math.max(1, rect.height)
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (runtime.current.y < 0) { runtime.current.x = width * .07; runtime.current.y = height - 42 - playerH }
    }
    const observer = new ResizeObserver(resize); observer.observe(canvas); resize()

    function loop(time: number) {
      frame = requestAnimationFrame(loop)
      if (!width || !height) return
      const sim = runtime.current
      const dt = sim.lastTime ? Math.min((time - sim.lastTime) / 1000, .034) : 0
      sim.lastTime = time
      // Platform berdekatan, tetapi punya sela kecil agar bentuk pulau tetap terpisah.
      // Pola setiap level berubah sedikit; ketinggian dibuat rendah dan ramah anak.
      const pattern = (level - 1) % 6
      const levelDrift = ((level - 1) % 12) * .0015
      const [leftLane, rightLane] = [[.06, .42], [.07, .43], [.08, .44], [.09, .45], [.10, .46], [.065, .425]][pattern]
      const step = level === 1 ? .037 : level === 2 ? .040 : .043
      const platformLayout = Array.from({ length: 5 }, (_, index) => ({
        // Ganti sisi setiap pijakan; selisih drift kecil membuat posisi tiap level unik.
        x: (index % 2 === 0 ? leftLane : rightLane) + levelDrift + (((level + index + pattern) % 3) * .0015),
        y: .82 - index * step - ((level + index) % 2) * .0015,
        w: .30,
      }))
      const platforms = [
        { x: -8, y: height - 42, w: width + 16, h: 60, ground: true },
        ...platformLayout.map(platform => ({ x: width * platform.x, y: height * platform.y, w: width * platform.w, h: 15 })),
      ]
      const forms = levelQuestions.map((item, index) => {
        const p = platforms[index + 1]
        return { item, x: p.x + p.w * .68, y: p.y - 22, size: 28 }
      })
      const coinPositions = [{ x: width * .46, y: height * .62 }, { x: width * .83, y: height * .43 }, { x: width * .50, y: height * .22 }]

      if (!sim.paused) {
        const speed = 215
        sim.vx = (Number(directions.current.right) - Number(directions.current.left)) * speed
        if (sim.vx) sim.facing = sim.vx > 0 ? 1 : -1
        sim.x += sim.vx * dt
        sim.x = Math.max(0, Math.min(width - playerW, sim.x))
        if (directions.current.jump && !sim.jumpHeld && sim.grounded) { sim.vy = -535; sim.grounded = false }
        sim.jumpHeld = directions.current.jump
        const previousBottom = sim.y + playerH
        sim.vy += 1450 * dt
        sim.y += sim.vy * dt
        sim.grounded = false
        if (sim.vy >= 0) {
          for (const p of platforms) {
            const horizontalHit = sim.x + playerW - 8 > p.x && sim.x + 8 < p.x + p.w
            if (horizontalHit && previousBottom <= p.y + 5 && sim.y + playerH >= p.y) { sim.y = p.y - playerH; sim.vy = 0; sim.grounded = true; break }
          }
        }
        if (sim.y > height + 100) { sim.x = width * .07; sim.y = height - 42 - playerH; sim.vy = 0 }

        for (const { item, x, y, size } of forms) {
          const overlap = sim.x + playerW > x - size / 2 && sim.x < x + size / 2 && sim.y + playerH > y - size / 2 && sim.y < y + size / 2
          if (!sim.collected.includes(item.id) && overlap && !sim.paused) { sim.paused = true; setActiveId(item.id); setChoice(null); setFeedback(null); break }
        }
        coinPositions.forEach((coin, index) => {
          const already = sim.foundCoins & (1 << index)
          const overlap = sim.x + playerW > coin.x - 13 && sim.x < coin.x + 13 && sim.y + playerH > coin.y - 13 && sim.y < coin.y + 13
          if (!already && overlap) { sim.foundCoins |= 1 << index; setCoinEarned(count => count + 1) }
        })
      }

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#7dd7f4'; ctx.fillRect(0, 0, width, height)
      if (world.complete && world.naturalWidth) {
        const scale = Math.max(width / world.naturalWidth, height / world.naturalHeight)
        const dw = world.naturalWidth * scale; const dh = world.naturalHeight * scale
        ctx.globalAlpha = .96; ctx.drawImage(world, (width - dw) / 2, height - dh, dw, dh); ctx.globalAlpha = 1
      }
      platforms.slice(1).forEach((p, index) => {
        const cliff = ctx.createLinearGradient(p.x, p.y + 8, p.x, p.y + 42)
        cliff.addColorStop(0, index % 2 ? '#a9784a' : '#94633c'); cliff.addColorStop(1, '#57463a')
        ctx.beginPath(); ctx.moveTo(p.x + 5, p.y + 7); ctx.lineTo(p.x + p.w - 5, p.y + 7); ctx.lineTo(p.x + p.w - 15, p.y + 16); ctx.lineTo(p.x + p.w - 31, p.y + 20); ctx.lineTo(p.x + p.w - 20, p.y + 29); ctx.lineTo(p.x + p.w - 39, p.y + 39); ctx.lineTo(p.x + 24, p.y + 36); ctx.lineTo(p.x + 31, p.y + 27); ctx.lineTo(p.x + 12, p.y + 21); ctx.closePath(); ctx.fillStyle = cliff; ctx.fill(); ctx.strokeStyle = '#69482f'; ctx.lineWidth = 2; ctx.stroke()
        // Facet batu berwarna hangat memberi tampilan tebing kartun berlapis.
        ctx.beginPath(); ctx.moveTo(p.x + 13, p.y + 17); ctx.lineTo(p.x + p.w * .34, p.y + 18); ctx.lineTo(p.x + p.w * .28, p.y + 33); ctx.lineTo(p.x + 23, p.y + 31); ctx.closePath(); ctx.fillStyle = '#b17b4d'; ctx.fill()
        ctx.beginPath(); ctx.moveTo(p.x + p.w * .42, p.y + 17); ctx.lineTo(p.x + p.w * .65, p.y + 18); ctx.lineTo(p.x + p.w * .60, p.y + 35); ctx.lineTo(p.x + p.w * .38, p.y + 32); ctx.closePath(); ctx.fillStyle = '#805438'; ctx.fill()
        ctx.beginPath(); ctx.moveTo(p.x + p.w * .72, p.y + 18); ctx.lineTo(p.x + p.w - 15, p.y + 17); ctx.lineTo(p.x + p.w - 28, p.y + 33); ctx.lineTo(p.x + p.w * .68, p.y + 34); ctx.closePath(); ctx.fillStyle = '#c08a54'; ctx.fill()
        ctx.save(); ctx.beginPath(); ctx.moveTo(p.x + 8, p.y + 9); ctx.lineTo(p.x + p.w - 8, p.y + 9); ctx.lineTo(p.x + p.w - 20, p.y + 29); ctx.lineTo(p.x + 24, p.y + 36); ctx.closePath(); ctx.clip()
        for (let rock = 0; rock < 4; rock++) { const rx = p.x + 18 + rock * (p.w - 38) / 3; ctx.fillStyle = rock % 2 ? '#78573e' : '#b17b4d'; ctx.beginPath(); ctx.ellipse(rx, p.y + 24 + (rock % 2) * 7, 8, 4, -.25, 0, Math.PI * 2); ctx.fill() }
        ctx.restore()
        const grass = ctx.createLinearGradient(0, p.y, 0, p.y + 14); grass.addColorStop(0, '#a8e86f'); grass.addColorStop(.45, '#6fd04c'); grass.addColorStop(1, '#43a943')
        ctx.beginPath(); ctx.moveTo(p.x + 4, p.y + 9); ctx.quadraticCurveTo(p.x + p.w * .22, p.y - 1, p.x + p.w * .42, p.y + 6); ctx.quadraticCurveTo(p.x + p.w * .72, p.y - 2, p.x + p.w - 4, p.y + 7); ctx.lineTo(p.x + p.w - 9, p.y + 19); ctx.lineTo(p.x + p.w - 17, p.y + 14); ctx.lineTo(p.x + p.w - 26, p.y + 20); ctx.lineTo(p.x + p.w * .62, p.y + 14); ctx.lineTo(p.x + p.w * .50, p.y + 20); ctx.lineTo(p.x + p.w * .38, p.y + 14); ctx.lineTo(p.x + 26, p.y + 19); ctx.lineTo(p.x + 17, p.y + 14); ctx.lineTo(p.x + 8, p.y + 18); ctx.lineTo(p.x + 7, p.y + 14); ctx.closePath(); ctx.fillStyle = grass; ctx.fill(); ctx.strokeStyle = '#d0f58a'; ctx.lineWidth = 2; ctx.stroke()
        ctx.strokeStyle = '#3c9e43'; ctx.lineWidth = 2; for (let tuft = 0; tuft < 5; tuft++) { const tx = p.x + 16 + tuft * (p.w - 32) / 4; ctx.beginPath(); ctx.moveTo(tx, p.y + 4); ctx.lineTo(tx - 3, p.y - (tuft % 2 ? 1 : 4)); ctx.moveTo(tx, p.y + 4); ctx.lineTo(tx + 4, p.y - 2); ctx.stroke() }
        if (index % 2 === 0) drawIslandTree(ctx, p.x + p.w * .27, p.y + 5, Math.min(1, p.w / 130))
      })
      ctx.fillStyle = '#79502f'; ctx.fillRect(0, height - 30, width, 30)
      ctx.beginPath(); ctx.moveTo(0, height - 42); ctx.quadraticCurveTo(width * .22, height - 52, width * .42, height - 41); ctx.quadraticCurveTo(width * .72, height - 53, width, height - 40); ctx.lineTo(width, height - 29); ctx.lineTo(0, height - 29); ctx.closePath(); ctx.fillStyle = '#69c84d'; ctx.fill(); ctx.strokeStyle = '#b4ee79'; ctx.lineWidth = 3; ctx.stroke()
      forms.forEach(({ item, x, y, size }) => { if (!sim.collected.includes(item.id)) drawShape(ctx, item.shape, x, y, size) })
      coinPositions.forEach((coin, index) => { if (!(sim.foundCoins & (1 << index))) { ctx.font = '21px system-ui'; ctx.textAlign = 'center'; ctx.fillText('🪙', coin.x, coin.y) } })
      if (sprites.complete && sprites.naturalWidth) {
        const cellW = sprites.naturalWidth / 3
        const pose = sim.paused ? 0 : Math.floor(time / 130) % 3
        ctx.save(); ctx.translate(sim.x + playerW / 2, sim.y + playerH); ctx.scale(sim.facing, 1)
        ctx.drawImage(sprites, pose * cellW, 1280, cellW, 2095, -playerW / 2, -playerH, playerW, playerH)
        ctx.restore()
      } else {
        ctx.fillStyle = '#ffca31'; ctx.beginPath(); ctx.moveTo(sim.x + playerW / 2, sim.y); ctx.lineTo(sim.x + playerW, sim.y + playerH); ctx.lineTo(sim.x, sim.y + playerH); ctx.closePath(); ctx.fill()
      }
    }
    frame = requestAnimationFrame(loop)
    const releaseKeys = () => { directions.current.left = false; directions.current.right = false; directions.current.jump = false }
    const keyDown = (event: KeyboardEvent) => { if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') directions.current.left = true; if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') directions.current.right = true; if (event.key === ' ' || event.key === 'ArrowUp') directions.current.jump = true }
    window.addEventListener('pointerup', releaseKeys); window.addEventListener('blur', releaseKeys); window.addEventListener('keydown', keyDown); window.addEventListener('keyup', releaseKeys)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('pointerup', releaseKeys); window.removeEventListener('blur', releaseKeys); window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', releaseKeys) }
  }, [level, levelQuestions])

  function answer(option: string) {
    if (!question || choice !== null) return
    setChoice(option)
    const right = option === question.answer
    if (right) { runtime.current.score += 100; runtime.current.correct += 1; setScoreEarned(runtime.current.score); setFeedback({ correct: true, text: `Benar! ${question.explanation}` }) }
    else setFeedback({ correct: false, text: `Jawaban yang tepat adalah ${question.answer}. ${question.explanation}` })
  }
  function continuePlay() {
    if (!question || choice === null) return
    runtime.current.collected.push(question.id); runtime.current.paused = false
    setCollectedCount(runtime.current.collected.length); setActiveId(null); setChoice(null); setFeedback(null)
  }
  function completeLevel() {
    onComplete({ score: score + scoreEarned, earned: scoreEarned, correct: runtime.current.correct, total: levelQuestions.length, rewardCoins: 100 + coinEarned * 5, coinBonus: coinEarned * 5 })
  }
  function hold(direction: Direction, active: boolean) { directions.current[direction] = active }

  return <section className="gameplay-screen" aria-label={`Eksplorasi level ${level}`}>
    <GameStatusBar score={score + scoreEarned} coins={coins + coinEarned * 5} onBack={onBack} />
    <div className="gameplay-title"><span>LEVEL {level} · EKSPLORASI</span><strong>Jelajahi pulau dan sentuh tantangannya!</strong><div className="gameplay-progress"><i style={{ width: `${collectedCount / levelQuestions.length * 100}%` }} /></div><small>{collectedCount}/{levelQuestions.length} tantangan ditemukan</small></div>
    <canvas ref={canvasRef} className="gameplay-canvas" aria-label="Dunia permainan: gerakkan Satik, lompat ke platform, dan tabrak bentuk untuk membuka kuis." />
    <div className="gameplay-controls" aria-label="Kontrol permainan">
      <button type="button" onPointerDown={() => hold('left', true)} onPointerUp={() => hold('left', false)} onPointerLeave={() => hold('left', false)} aria-label="Kiri">◀</button>
      <button type="button" onPointerDown={() => hold('right', true)} onPointerUp={() => hold('right', false)} onPointerLeave={() => hold('right', false)} aria-label="Kanan">▶</button>
      <button className="gameplay-controls__jump" type="button" onPointerDown={() => hold('jump', true)} onPointerUp={() => hold('jump', false)} onPointerLeave={() => hold('jump', false)} aria-label="Lompat">⬆<small>LOMPAT</small></button>
    </div>
    {collectedCount === levelQuestions.length && <button className="gameplay-finish" onClick={completeLevel} type="button">Selesaikan level <span>→</span></button>}
    {question && <div className="quiz-backdrop"><section className="quiz-card" role="dialog" aria-modal="true" aria-labelledby="quiz-title"><div className="quiz-card__handle"/><p className="quiz-card__eyebrow">BENTUK DITEMUKAN · {question.object.toUpperCase()}</p>
      {question.illustration === 'house' ? <img className="quiz-card__illustration" src={quizHouse} alt="Ilustrasi rumah dengan atap berbentuk segitiga" /> : <div className={`quiz-card__shape quiz-card__shape--${question.shape}`}>{question.symbol}</div>}
      <h2 id="quiz-title">{question.prompt}</h2>
      <div className="quiz-options">{question.options.map(option => <button key={option} type="button" disabled={choice !== null} onClick={() => answer(option)} className={`quiz-option${choice === option ? ' is-selected' : ''}${feedback?.correct && option === question.answer ? ' is-answer' : ''}${choice === option && feedback && !feedback.correct ? ' is-wrong' : ''}`}><span>{choice === option ? (feedback?.correct ? '✓' : '×') : ''}</span>{option}</button>)}</div>
      {feedback && <div className={`quiz-feedback ${feedback.correct ? 'is-right' : 'is-wrong'}`} role="status"><strong>{feedback.correct ? 'Jawaban benar! +100 poin' : 'Belum tepat, poinmu tetap aman.'}</strong><span>{feedback.text}</span></div>}
      <button className="game-action game-action--yellow quiz-continue" onClick={continuePlay} disabled={choice === null} type="button">{choice === null ? 'Pilih jawaban' : 'Lanjutkan'} <span>➜</span></button>
    </section></div>}
  </section>
}
