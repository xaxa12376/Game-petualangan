import { useState } from 'react'

type Question = {
  topic: string
  symbol: string
  prompt: string
  options: string[]
  answer: string
  explanation: string
}

type LevelGameProps = {
  level: number
  completed: boolean
  onBack: () => void
  onComplete: (level: number) => void
}

const questions: Question[] = [
  { topic: 'Pulau Bentuk', symbol: '□', prompt: 'Berapa banyak sisi yang dimiliki persegi?', options: ['3 sisi', '4 sisi', '5 sisi', '6 sisi'], answer: '4 sisi', explanation: 'Persegi mempunyai empat sisi yang sama panjang.' },
  { topic: 'Pulau Bentuk', symbol: '△', prompt: 'Bangun datar apa yang mempunyai tiga sisi?', options: ['Lingkaran', 'Persegi', 'Segitiga', 'Persegi panjang'], answer: 'Segitiga', explanation: 'Segitiga selalu mempunyai tiga sisi dan tiga sudut.' },
  { topic: 'Pulau Bentuk', symbol: '○', prompt: 'Apa yang benar tentang lingkaran?', options: ['Memiliki 3 sudut', 'Memiliki 4 sisi', 'Tidak memiliki sudut', 'Memiliki 5 sisi'], answer: 'Tidak memiliki sudut', explanation: 'Lingkaran berbentuk lengkung dan tidak memiliki titik sudut.' },
  { topic: 'Pulau Bentuk', symbol: '▭', prompt: 'Persegi panjang memiliki ... pasang sisi berhadapan yang sama panjang.', options: ['1', '2', '3', '4'], answer: '2', explanation: 'Kedua pasang sisi yang berhadapan pada persegi panjang sama panjang.' },
  { topic: 'Pulau Bentuk', symbol: '◇', prompt: 'Ciri utama persegi adalah ...', options: ['Semua sisinya sama panjang', 'Tidak punya sudut', 'Hanya punya 3 sisi', 'Sisinya melengkung'], answer: 'Semua sisinya sama panjang', explanation: 'Keempat sisi persegi sama panjang dan semua sudutnya siku-siku.' },
  { topic: 'Pulau Bentuk', symbol: '△', prompt: 'Jumlah besar sudut dalam sebuah segitiga adalah ...', options: ['90°', '180°', '270°', '360°'], answer: '180°', explanation: 'Jika dijumlahkan, tiga sudut dalam segitiga selalu 180°.' },
  { topic: 'Hutan Segi Empat', symbol: '▱', prompt: 'Bangun segi empat memiliki berapa sisi?', options: ['3', '4', '5', '6'], answer: '4', explanation: 'Segi empat adalah bangun datar yang mempunyai empat sisi.' },
  { topic: 'Hutan Segi Empat', symbol: '▱', prompt: 'Pada jajar genjang, sisi yang berhadapan selalu ...', options: ['Melengkung', 'Sejajar', 'Tegak lurus', 'Berbeda panjang'], answer: 'Sejajar', explanation: 'Jajar genjang memiliki dua pasang sisi berhadapan yang sejajar.' },
  { topic: 'Hutan Segi Empat', symbol: '◇', prompt: 'Belah ketupat memiliki ...', options: ['Empat sisi sama panjang', 'Tiga sisi sama panjang', 'Satu sisi lengkung', 'Lima sudut'], answer: 'Empat sisi sama panjang', explanation: 'Keempat sisi belah ketupat memiliki panjang yang sama.' },
  { topic: 'Hutan Segi Empat', symbol: '⏢', prompt: 'Trapesium memiliki paling sedikit ... pasang sisi sejajar.', options: ['Tidak ada', 'Satu', 'Dua', 'Tiga'], answer: 'Satu', explanation: 'Trapesium memiliki satu pasang sisi sejajar.' },
  { topic: 'Hutan Segi Empat', symbol: '▭', prompt: 'Persegi panjang berukuran 8 cm × 4 cm. Berapa kelilingnya?', options: ['12 cm', '24 cm', '32 cm', '48 cm'], answer: '24 cm', explanation: 'Keliling = 2 × (8 + 4) = 24 cm.' },
  { topic: 'Hutan Segi Empat', symbol: '□', prompt: 'Persegi memiliki sisi 5 cm. Berapa kelilingnya?', options: ['10 cm', '15 cm', '20 cm', '25 cm'], answer: '20 cm', explanation: 'Keliling persegi = 4 × sisi = 4 × 5 = 20 cm.' },
  { topic: 'Pegunungan Segitiga', symbol: '△', prompt: 'Setiap sudut pada segitiga sama sisi besarnya ...', options: ['30°', '45°', '60°', '90°'], answer: '60°', explanation: 'Tiga sudut sama besar dan jumlahnya 180°, jadi setiap sudut 60°.' },
  { topic: 'Pegunungan Segitiga', symbol: '△', prompt: 'Segitiga sama kaki memiliki ...', options: ['Dua sisi sama panjang', 'Tiga sudut siku-siku', 'Empat sisi', 'Satu sisi lengkung'], answer: 'Dua sisi sama panjang', explanation: 'Segitiga sama kaki memiliki sepasang sisi yang sama panjang.' },
  { topic: 'Pegunungan Segitiga', symbol: '◿', prompt: 'Segitiga siku-siku selalu memiliki satu sudut sebesar ...', options: ['45°', '60°', '90°', '180°'], answer: '90°', explanation: 'Sudut siku-siku besarnya tepat 90°.' },
  { topic: 'Pegunungan Segitiga', symbol: '△', prompt: 'Segitiga memiliki alas 6 cm dan tinggi 4 cm. Berapa luasnya?', options: ['10 cm²', '12 cm²', '20 cm²', '24 cm²'], answer: '12 cm²', explanation: 'Luas segitiga = ½ × alas × tinggi = ½ × 6 × 4 = 12 cm².' },
  { topic: 'Pegunungan Segitiga', symbol: '▭', prompt: 'Berapa luas persegi panjang dengan panjang 8 cm dan lebar 5 cm?', options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'], answer: '40 cm²', explanation: 'Luas persegi panjang = panjang × lebar = 8 × 5 = 40 cm².' },
  { topic: 'Pegunungan Segitiga', symbol: '□', prompt: 'Sisi persegi 6 cm. Berapa luasnya?', options: ['12 cm²', '24 cm²', '30 cm²', '36 cm²'], answer: '36 cm²', explanation: 'Luas persegi = sisi × sisi = 6 × 6 = 36 cm².' },
  { topic: 'Danau Lingkaran', symbol: '○', prompt: 'Jari-jari lingkaran 7 cm. Berapa diameternya?', options: ['3,5 cm', '7 cm', '14 cm', '21 cm'], answer: '14 cm', explanation: 'Diameter = 2 × jari-jari = 2 × 7 = 14 cm.' },
  { topic: 'Danau Lingkaran', symbol: '◉', prompt: 'Diameter sebuah lingkaran 12 cm. Jari-jarinya adalah ...', options: ['3 cm', '6 cm', '12 cm', '24 cm'], answer: '6 cm', explanation: 'Jari-jari adalah setengah diameter, jadi 12 ÷ 2 = 6 cm.' },
  { topic: 'Danau Lingkaran', symbol: '○', prompt: 'Rumus luas lingkaran adalah ...', options: ['π × r', '2 × π × r', 'π × r × r', '4 × sisi'], answer: 'π × r × r', explanation: 'Luas lingkaran dihitung dengan rumus π × jari-jari × jari-jari.' },
  { topic: 'Danau Lingkaran', symbol: '◉', prompt: 'Keliling lingkaran dengan jari-jari 7 cm adalah ... (π = 22/7)', options: ['22 cm', '44 cm', '77 cm', '154 cm'], answer: '44 cm', explanation: 'Keliling = 2 × π × r = 2 × 22/7 × 7 = 44 cm.' },
  { topic: 'Danau Lingkaran', symbol: '⬡', prompt: 'Bangun beraturan memiliki ...', options: ['Sisi dan sudut yang sama besar', 'Hanya sisi lengkung', 'Tiga sisi saja', 'Tidak memiliki sudut'], answer: 'Sisi dan sudut yang sama besar', explanation: 'Pada bangun beraturan, semua sisi dan semua sudutnya sama.' },
  { topic: 'Danau Lingkaran', symbol: '▱', prompt: 'Cara mencari keliling bangun datar adalah ...', options: ['Menjumlahkan panjang semua sisi', 'Mengalikan semua sudut', 'Membagi luas dengan sisi', 'Menghitung jumlah warna'], answer: 'Menjumlahkan panjang semua sisi', explanation: 'Keliling adalah total panjang seluruh sisi di sekeliling bangun.' },
  { topic: 'Kastil Geometri', symbol: '⬠', prompt: 'Bangun datar yang memiliki lima sisi disebut ...', options: ['Segitiga', 'Segi empat', 'Segi lima', 'Segi enam'], answer: 'Segi lima', explanation: 'Awalan penta berarti lima; segi lima memiliki lima sisi.' },
  { topic: 'Kastil Geometri', symbol: '◇', prompt: 'Jumlah sudut dalam segi empat adalah ...', options: ['180°', '270°', '360°', '540°'], answer: '360°', explanation: 'Jumlah keempat sudut dalam semua segi empat adalah 360°.' },
  { topic: 'Kastil Geometri', symbol: '⬡', prompt: 'Berapa banyak sisi yang dimiliki segi enam?', options: ['5 sisi', '6 sisi', '7 sisi', '8 sisi'], answer: '6 sisi', explanation: 'Segi enam memiliki enam sisi dan enam titik sudut.' },
  { topic: 'Kastil Geometri', symbol: '∠', prompt: 'Sudut lancip besarnya ...', options: ['Kurang dari 90°', 'Tepat 90°', 'Lebih dari 90°', 'Tepat 180°'], answer: 'Kurang dari 90°', explanation: 'Sudut lancip lebih kecil dari sudut siku-siku (90°).' },
  { topic: 'Kastil Geometri', symbol: '▭', prompt: 'Persegi panjang panjangnya 12 cm dan lebarnya 7 cm. Kelilingnya ...', options: ['19 cm', '26 cm', '38 cm', '84 cm'], answer: '38 cm', explanation: 'Keliling = 2 × (12 + 7) = 38 cm.' },
  { topic: 'Kastil Geometri', symbol: '△', prompt: 'Sebuah segitiga memiliki sisi 5 cm, 6 cm, dan 7 cm. Kelilingnya ...', options: ['11 cm', '18 cm', '30 cm', '42 cm'], answer: '18 cm', explanation: 'Keliling segitiga = 5 + 6 + 7 = 18 cm.' },
]

function LevelGame({ level, completed, onBack, onComplete }: LevelGameProps) {
  const question = questions[level - 1]
  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === question.answer

  return (
    <section className="level-game" aria-label={`Kuis level ${level}`}>
      <header className="level-game__header">
        <button className="level-game__back" onClick={onBack} type="button" aria-label="Kembali ke peta">‹</button>
        <div><span>{question.topic}</span><strong>Level {level} dari 30</strong></div>
        <span className="level-game__star">⭐</span>
      </header>
      <div className="level-game__progress"><i style={{ width: `${(level / 30) * 100}%` }} /></div>
      <div className="level-game__content">
        <div className="level-game__shape" aria-hidden="true">{question.symbol}</div>
        <p className="level-game__eyebrow">Pilih jawaban yang benar</p>
        <h1>{question.prompt}</h1>
        <div className="level-game__answers">
          {question.options.map((option) => {
            const chosen = selected === option
            const right = selected !== null && option === question.answer
            return (
              <button
                className={`level-game__answer${chosen ? ' is-selected' : ''}${right ? ' is-correct' : ''}${chosen && !isCorrect ? ' is-wrong' : ''}`}
                disabled={isCorrect}
                key={option}
                onClick={() => setSelected(option)}
                type="button"
              >
                <span className="level-game__answer-dot">{chosen ? (isCorrect ? '✓' : '×') : ''}</span>{option}
              </button>
            )
          })}
        </div>
        {selected && (
          <div className={`level-game__feedback${isCorrect ? ' is-correct' : ' is-wrong'}`} role="status">
            <strong>{isCorrect ? 'Jawaban benar! 🎉' : 'Belum tepat, coba lagi ya.'}</strong>
            {isCorrect && <span>{question.explanation}</span>}
          </div>
        )}
        {isCorrect ? (
          <button className="level-game__continue" onClick={() => onComplete(level)} type="button">
            {completed ? 'Kembali ke Peta' : 'Selesai, lanjut ke peta'} <span>→</span>
          </button>
        ) : selected ? (
          <button className="level-game__continue level-game__continue--retry" onClick={() => setSelected(null)} type="button">Coba Lagi</button>
        ) : (
          <button className="level-game__continue" disabled type="button">Pilih jawaban</button>
        )}
      </div>
    </section>
  )
}

export default LevelGame

