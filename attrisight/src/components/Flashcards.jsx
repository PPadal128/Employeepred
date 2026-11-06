import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import Reveal from './Reveal.jsx'

const CARDS = [
  { topic: 'Employee churn', q: 'What is employee churn?', a: 'The rate at which employees leave an organisation over a period. High churn raises hiring costs and drains knowledge from teams.' },
  { topic: 'Support Vector Machine', q: 'How does an SVM make a decision?', a: 'It finds the boundary that separates leavers from stayers with the widest possible margin, then classifies new records by which side they fall on.' },
  { topic: 'Churn probability', q: 'What does a 70% churn probability mean?', a: 'The model rates this record as similar to past leavers. It is a relative risk signal, not a promise that the person will leave.' },
  { topic: 'Employee retention', q: 'What actually improves retention?', a: 'Fair pay, clear growth paths, manageable workloads and good managers. Predictions help you decide where to look first, not what to conclude.' },
  { topic: 'Machine learning features', q: 'What is a feature?', a: 'One measurable input the model learns from. AttriSight uses eight: education, joining year, city, payment tier, gender, age, benched history and domain experience.' },
  { topic: 'Workforce analytics', q: 'Why use analytics for people decisions?', a: 'To spot patterns across hundreds of records that no manager could track alone, while keeping humans responsible for the final decision.' },
]

function Card({ c, state, onFlip }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="fc">
      <button className="fc__btn" aria-pressed={flipped} onClick={() => setFlipped(!flipped)} aria-label={`${c.topic}. ${flipped ? c.a : c.q}`}>
        <motion.div className="fc__in" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className="fc__face"><p className="fc__topic">{c.topic}</p><h3>{c.q}</h3><span className="fc__hint">Click to reveal</span></div>
          <div className="fc__face fc__face--back"><p className="fc__topic">{c.topic}</p><p>{c.a}</p></div>
        </motion.div>
      </button>
      {flipped && (
        <div className="fc__mark" role="group" aria-label="Mark this card">
          <button className={state === 'known' ? 'on' : ''} onClick={() => onFlip('known')}>Got it</button>
          <button className={state === 'again' ? 'on' : ''} onClick={() => onFlip('again')}>Review again</button>
        </div>
      )}
    </div>
  )
}

export default function Flashcards() {
  const [marks, setMarks] = useState({})
  const known = Object.values(marks).filter((m) => m === 'known').length
  return (
    <section id="learn" className="section">
      <div className="wrap">
        <div className="history__head">
          <Reveal><h2 className="h2">Learn the language of attrition.</h2><p className="lead lead--dark">Flip a card, then sort it into got it or review again.</p></Reveal>
          <div className="score" aria-live="polite"><strong>{known}/{CARDS.length}</strong><span>known</span>
            {Object.keys(marks).length > 0 && <button onClick={() => setMarks({})} aria-label="Reset score"><RotateCcw size={16} /></button>}</div>
        </div>
        <div className="fc__grid">
          {CARDS.map((c, i) => <Reveal key={c.topic} delay={(i % 3) * 0.06}><Card c={c} state={marks[i]} onFlip={(s) => setMarks({ ...marks, [i]: s })} /></Reveal>)}
        </div>
      </div>
    </section>
  )
}
