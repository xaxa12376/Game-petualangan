import type { NavigationItem } from './BottomNavigation'

type ScreenTab = Exclude<NavigationItem, 'Beranda' | 'Peta'>
type OtherScreensProps = {
  tab: ScreenTab
  stars: number
  unlockedLevel: number
  completedLevels: number[]
}

const lessons = [
  { title: 'Pulau Bentuk', range: 'Level 1–6', detail: 'Kenali sisi, sudut, persegi, persegi panjang, dan segitiga.' },
  { title: 'Hutan Segi Empat', range: 'Level 7–12', detail: 'Pelajari jajar genjang, belah ketupat, trapesium, dan keliling.' },
  { title: 'Pegunungan Segitiga', range: 'Level 13–18', detail: 'Kenali jenis segitiga, jumlah sudut, luas, dan keliling.' },
  { title: 'Danau Lingkaran', range: 'Level 19–24', detail: 'Pahami jari-jari, diameter, luas, dan keliling lingkaran.' },
  { title: 'Kastil Geometri', range: 'Level 25–30', detail: 'Uji pemahaman bangun datar dan hitungannya.' },
]

function OtherScreens({ tab, stars, unlockedLevel, completedLevels }: OtherScreensProps) {
  if (tab === 'Materi') {
    return (
      <section className="content-screen" aria-label="Materi bangun datar">
        <p className="content-screen__eyebrow">Belajar sambil menjelajah</p>
        <h1>Materi Bangun Datar</h1>
        <p className="content-screen__intro">Pilih pulau untuk melihat topik yang akan kamu pelajari.</p>
        <div className="content-screen__cards">
          {lessons.map((lesson, index) => (
            <article className="content-card" key={lesson.title}>
              <span className="content-card__number">{index + 1}</span>
              <div><strong>{lesson.title}</strong><small>{lesson.range}</small><p>{lesson.detail}</p></div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (tab === 'Prestasi') {
    return (
      <section className="content-screen" aria-label="Prestasi pemain">
        <p className="content-screen__eyebrow">Terus kumpulkan bintang</p>
        <h1>Prestasi</h1>
        <div className="achievement-summary">
          <div><span>⭐</span><strong>{stars}</strong><small>Bintang</small></div>
          <div><span>🏁</span><strong>{completedLevels.length}/30</strong><small>Level selesai</small></div>
          <div><span>🗺️</span><strong>{unlockedLevel}/30</strong><small>Level terbuka</small></div>
        </div>
        <article className="content-card achievement-card">
          <span className="achievement-card__icon">🏅</span>
          <div><strong>Penjelajah Bangun Datar</strong><small>{completedLevels.length >= 30 ? 'Hebat! Semua level selesai.' : `Selesaikan ${30 - completedLevels.length} level lagi untuk menuntaskan peta.`}</small></div>
        </article>
      </section>
    )
  }

  return (
    <section className="content-screen" aria-label="Profil pemain">
      <p className="content-screen__eyebrow">Petualang bangun datar</p>
      <h1>Profil</h1>
      <article className="profile-card">
        <div className="profile-card__avatar">R</div>
        <div><small>Siswa</small><strong>Rizki</strong><span>Level terbuka {unlockedLevel} dari 30</span></div>
      </article>
      <div className="achievement-summary profile-summary">
        <div><span>⭐</span><strong>{stars}</strong><small>Total bintang</small></div>
        <div><span>🎯</span><strong>{completedLevels.length}</strong><small>Level selesai</small></div>
      </div>
    </section>
  )
}

export default OtherScreens
