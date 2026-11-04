export type ShapeQuestion = {
  id: string
  shape: 'triangle' | 'square' | 'circle' | 'rectangle'
  symbol: string
  object: string
  prompt: string
  options: string[]
  answer: string
  explanation: string
  illustration?: 'house'
}

const shapes = ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang']
const shapeVisuals: Record<string, ShapeQuestion['shape']> = {
  Segitiga: 'triangle', Persegi: 'square', Lingkaran: 'circle', 'Persegi panjang': 'rectangle',
}
const shapeSymbols: Record<string, string> = { Segitiga: '▲', Persegi: '■', Lingkaran: '●', 'Persegi panjang': '▰' }

function numberOptions(answer: number, suffix: string, level: number) {
  const candidates = [answer, answer + 2, Math.max(1, answer - 1), answer + 4]
  const unique = [...new Set(candidates)].slice(0, 4)
  const shift = level % unique.length
  return [...unique.slice(shift), ...unique.slice(0, shift)].map(value => `${value} ${suffix}`)
}

/** Lima tantangan yang beragam untuk setiap level: benda, sifat bentuk, keliling, pola, dan luas. */
export function questionsForLevel(level: number): ShapeQuestion[] {
  const safeLevel = Math.max(1, Math.floor(level))
  const objects: { name: string; shape: string; illustration?: 'house' }[] = [
    { name: 'Atap rumah', shape: 'Segitiga', illustration: 'house' as const },
    { name: 'Jendela taman', shape: 'Persegi' },
    { name: 'Roda gerobak', shape: 'Lingkaran' },
    { name: 'Papan petunjuk', shape: 'Persegi panjang' },
    { name: 'Bendera bukit', shape: 'Segitiga' },
    { name: 'Ubin teras', shape: 'Persegi' },
    { name: 'Piring piknik', shape: 'Lingkaran' },
    { name: 'Buku cerita', shape: 'Persegi panjang' },
  ]
  const object = objects[(safeLevel - 1) % objects.length]
  const sideCount = 3 + (safeLevel % 2)
  const sideShape = sideCount === 3 ? 'segitiga' : 'persegi'
  const length = 3 + (safeLevel % 5)
  const width = 2 + (safeLevel % 3)
  const perimeter = 2 * (length + width)
  const areaLength = 2 + (safeLevel % 4)
  const areaWidth = 2 + ((safeLevel + 1) % 3)
  const area = areaLength * areaWidth
  const patterns = [
    { seq: 'Segitiga, Persegi, Segitiga, Persegi, ...', answer: 'Segitiga' },
    { seq: 'Lingkaran, Lingkaran, Persegi, Lingkaran, Lingkaran, Persegi, ...', answer: 'Lingkaran' },
    { seq: 'Persegi panjang, Segitiga, Lingkaran, Persegi panjang, Segitiga, ...', answer: 'Lingkaran' },
    { seq: 'Persegi, Lingkaran, Persegi, Lingkaran, ...', answer: 'Persegi' },
  ]
  const pattern = patterns[(safeLevel - 1) % patterns.length]
  const numeric = (answer: number, unit: string) => numberOptions(answer, unit, safeLevel)

  return [
    {
      id: `object-${safeLevel}`, shape: shapeVisuals[object.shape], symbol: shapeSymbols[object.shape], object: object.name,
      prompt: `${object.name} pada gambar ini paling mirip bentuk apa?`, options: [...shapes].sort((a, b) => ((shapes.indexOf(a) + safeLevel) % 4) - ((shapes.indexOf(b) + safeLevel) % 4)),
      answer: object.shape, explanation: `${object.name} menyerupai ${object.shape.toLowerCase()}.`,
      ...(object.illustration ? { illustration: object.illustration } : {}),
    },
    {
      id: `sides-${safeLevel}`, shape: sideShape === 'segitiga' ? 'triangle' : 'square', symbol: sideShape === 'segitiga' ? '▲' : '■', object: 'Tebing bentuk',
      prompt: `${sideShape === 'segitiga' ? 'Segitiga' : 'Persegi'} memiliki berapa sisi?`, options: ['2 sisi', '3 sisi', '4 sisi', '5 sisi'],
      answer: `${sideCount} sisi`, explanation: `${sideShape === 'segitiga' ? 'Segitiga' : 'Persegi'} memiliki ${sideCount} sisi lurus.`,
    },
    {
      id: `perimeter-${safeLevel}`, shape: 'rectangle', symbol: '▰', object: 'Pagar taman',
      prompt: `Pagar persegi panjang panjangnya ${length} m dan lebarnya ${width} m. Berapa kelilingnya?`, options: numeric(perimeter, 'm'),
      answer: `${perimeter} m`, explanation: `Keliling = 2 × (panjang + lebar), jadi 2 × (${length} + ${width}) = ${perimeter} m.`,
    },
    {
      id: `pattern-${safeLevel}`, shape: shapeVisuals[pattern.answer], symbol: shapeSymbols[pattern.answer], object: 'Jejak ajaib',
      prompt: `Bentuk apa yang melanjutkan pola ini? ${pattern.seq}`, options: [...shapes].sort((a, b) => ((shapes.indexOf(a) + safeLevel) % 4) - ((shapes.indexOf(b) + safeLevel) % 4)),
      answer: pattern.answer, explanation: 'Perhatikan urutan bentuk yang berulang untuk menemukan bentuk berikutnya.',
    },
    {
      id: `area-${safeLevel}`, shape: 'square', symbol: '▦', object: 'Lantai taman baca',
      prompt: `Lantai berbentuk persegi panjang berukuran ${areaLength} m × ${areaWidth} m. Berapa luasnya?`, options: numeric(area, 'm²'),
      answer: `${area} m²`, explanation: `Luas = panjang × lebar, jadi ${areaLength} × ${areaWidth} = ${area} m².`,
    },
  ]
}
