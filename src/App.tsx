import { useState } from 'react'
import './App.css'
import AdventureMap from './components/AdventureMap'
import AdventureScene from './components/AdventureScene'
import BottomNavigation, { type NavigationItem } from './components/BottomNavigation'
import GameHeader from './components/GameHeader'
import LevelDetail from './components/LevelDetail'
import Gameplay from './components/Gameplay'
import LevelComplete from './components/LevelComplete'
import './components/LevelFlow.css'
import OtherScreens from './components/OtherScreens'

type SavedProgress = { unlockedLevel: number; completedLevels: number[]; stars: number }
const progressKey = 'petualangan-bangun-datar-progress'

function readProgress(): SavedProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey) ?? 'null') as Partial<SavedProgress> | null
    if (saved && Array.isArray(saved.completedLevels)) {
      const completedLevels = [...new Set(saved.completedLevels.filter((level) => Number.isInteger(level) && level >= 1 && level <= 30))]
      let unlockedLevel = 1
      while (completedLevels.includes(unlockedLevel) && unlockedLevel < 30) unlockedLevel += 1
      return {
        unlockedLevel,
        completedLevels,
        stars: Math.max(0, Number(saved.stars) || completedLevels.length),
      }
    }
  } catch {
    // Mulai dari progres baru jika data tersimpan tidak dapat dibaca.
  }
  return { unlockedLevel: 1, completedLevels: [], stars: 0 }
}

function App() {
  const [activeTab, setActiveTab] = useState<NavigationItem>('Beranda')
  const [progress, setProgress] = useState<SavedProgress>(readProgress)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [flowStage, setFlowStage] = useState<'detail' | 'game' | 'result'>('detail')
  const [quizResult, setQuizResult] = useState({ score: 120, earned: 0, correct: 0, total: 5, rewardCoins: 100, coinBonus: 0 })
  const [coins, setCoins] = useState(45)
  const [notice, setNotice] = useState('')

  function chooseLevel(level: number) {
    if (level > progress.unlockedLevel) {
      setNotice(`Selesaikan level ${progress.unlockedLevel} terlebih dahulu untuk membuka level ${level}.`)
      return
    }
    setNotice('')
    setFlowStage('detail')
    setSelectedLevel(level)
  }

  function finishLevel(level: number) {
    const alreadyCompleted = progress.completedLevels.includes(level)
    setProgress((current) => {
      if (current.completedLevels.includes(level)) return current
      const next: SavedProgress = {
        completedLevels: [...current.completedLevels, level].sort((a, b) => a - b),
        unlockedLevel: Math.min(30, Math.max(current.unlockedLevel, level + 1)),
        stars: current.stars + 1,
      }
      try { localStorage.setItem(progressKey, JSON.stringify(next)) } catch { /* Progres tetap aktif selama aplikasi terbuka. */ }
      return next
    })
    setSelectedLevel(null)
    setCoins(current => current + quizResult.rewardCoins)
    setActiveTab('Peta')
    setNotice(alreadyCompleted ? `Level ${level} selesai!` : `Hebat! Level ${level} selesai dan 1 bintang didapat.`)
  }

  const isPlaying = selectedLevel !== null
  const isOnMap = activeTab === 'Peta'
  const missionProgress = Math.min(progress.completedLevels.length, 3)

  return (
    <main className={`game-home${isOnMap ? ' game-home--map' : ''}${isPlaying ? ' game-home--playing' : ''}`}>
      {isPlaying ? (
        flowStage === 'detail' ? (
          <LevelDetail level={selectedLevel} completed={progress.completedLevels.includes(selectedLevel)} score={120} coins={coins} onBack={() => setSelectedLevel(null)} onStart={() => setFlowStage('game')} />
        ) : flowStage === 'game' ? (
          <Gameplay level={selectedLevel} score={120} coins={coins} onBack={() => setFlowStage('detail')} onComplete={(result) => { setQuizResult(result); setFlowStage('result') }} />
        ) : (
          <LevelComplete level={selectedLevel} {...quizResult} coins={coins + quizResult.coinBonus} onContinue={() => finishLevel(selectedLevel)} onRetry={() => setFlowStage('game')} />
        )
      ) : isOnMap ? (
        <AdventureMap
          notice={notice}
          unlockedLevel={progress.unlockedLevel}
          completedLevels={progress.completedLevels}
          starCount={120 + progress.stars}
          coinCount={coins}
          onBack={() => { setNotice(''); setActiveTab('Beranda') }}
          onSelectLevel={chooseLevel}
          onShowMission={() => setNotice(`Misi harian: selesaikan 3 level dengan nilai sempurna. Progres ${missionProgress}/3.`)}
          onShowCollection={() => setNotice(`Koleksi bintang: ${progress.stars} bintang terkumpul.`)}
          onDismissNotice={() => setNotice('')}
        />
      ) : (
        <>
          <div className="game-home__landscape" aria-hidden="true" />
          <GameHeader starCount={120 + progress.stars} coinCount={coins} missionProgress={missionProgress} playerLevel={progress.unlockedLevel} />
          {activeTab === 'Beranda' ? (
            <AdventureScene onStartAdventure={() => { setNotice(''); setActiveTab('Peta') }} />
          ) : (
            <OtherScreens
              tab={activeTab}
              stars={120 + progress.stars}
              unlockedLevel={progress.unlockedLevel}
              completedLevels={progress.completedLevels}
            />
          )}
        </>
      )}
      {!isPlaying && <BottomNavigation activeItem={activeTab} onSelect={(item) => { setNotice(''); setActiveTab(item) }} />}
    </main>
  )
}

export default App

